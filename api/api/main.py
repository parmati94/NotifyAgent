from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List
import os
import smtplib
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from jose import JWTError, jwt
from . import models, schemas, crud
from .database import SessionLocal, engine, get_db
from .auth import create_access_token, get_current_user, get_current_active_user, get_admin_user, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash, verify_password, oauth2_scheme, SECRET_KEY, ALGORITHM

app = FastAPI(root_path="/api")

load_dotenv()

models.Base.metadata.create_all(bind=engine)

# Function moved from auth.py to fix circular imports
def authenticate_user(db: Session, username: str, password: str):
    user = crud.get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

# Create admin user on startup if no users exist
def create_admin_user():
    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            # Get admin credentials from environment variables or use defaults
            admin_username = os.getenv("ADMIN_USERNAME", "admin")
            admin_password = os.getenv("ADMIN_PASSWORD", "admin")
            print(f"No users found. Creating default admin user '{admin_username}'")
            
            hashed_password = get_password_hash(admin_password)
            db_user = models.User(username=admin_username, password_hash=hashed_password, is_admin=True)
            db.add(db_user)
            db.commit()
            print(f"Admin user '{admin_username}' created successfully!")
    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

# Create admin user on startup
create_admin_user()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication routes
@app.post("/login/", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Calculate expiry timestamp in milliseconds for frontend
    expiry_ms = int((datetime.utcnow() + access_token_expires).timestamp() * 1000)
    
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"token": access_token, "username": user.username, "expires_at": expiry_ms}

@app.post("/refresh-token/")
async def refresh_token(current_user = Depends(get_current_user)):
    # Generate a new token with a fresh expiration time
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Calculate expiry timestamp in milliseconds for frontend
    expiry_ms = int((datetime.utcnow() + access_token_expires).timestamp() * 1000)
    
    # Create new token
    access_token = create_access_token(
        data={"sub": current_user.username}, expires_delta=access_token_expires
    )
    
    return {"token": access_token, "username": current_user.username, "expires_at": expiry_ms}

@app.get("/verify-token/")
async def verify_token(current_user = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    try:
        # Decode token to get expiry time
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        
        # Calculate expiry time in milliseconds (for frontend)
        expiry_ms = int(exp) * 1000 if exp else None
        
        return {
            "valid": True, 
            "username": current_user.username,
            "expiry": expiry_ms
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# User management routes
@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), admin_user = Depends(get_admin_user)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin_user = Depends(get_admin_user)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/me/", response_model=schemas.User)
async def read_user_me(current_user = Depends(get_current_active_user)):
    return current_user

@app.get("/users/{user_id}", response_model=schemas.User)
async def read_user(user_id: int, db: Session = Depends(get_db), admin_user = Depends(get_admin_user)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/users/{user_id}", response_model=schemas.User)
async def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db), admin_user = Depends(get_admin_user)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db=db, user_id=user_id, user=user)

@app.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db), admin_user = Depends(get_admin_user)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if this is the only admin user
    if db_user.is_admin:
        admin_count = db.query(models.User).filter(models.User.is_admin == True).count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Cannot delete the only admin user. Create another admin user first."
            )
    
    result = crud.delete_user(db=db, user_id=user_id)
    if result:
        return {"detail": "User deleted successfully"}
    raise HTTPException(status_code=500, detail="Failed to delete user")

# Load environment variables
EMAIL_ADDRESS = os.getenv('EMAIL_ADDRESS')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

# Function to send email
def send_email_bcc(db: Session, recipients, subject, body):
    # Fetch email credentials from the database
    credentials = crud.get_email_credentials(db)
    print(f"Email credentials: {credentials.email_address, credentials.email_password}")
    if not credentials:
        raise HTTPException(status_code=404, detail="Email credentials not found")

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(credentials.email_address, credentials.email_password)

        msg = MIMEMultipart()
        msg['From'] = credentials.email_address
        msg['To'] = credentials.email_address
        msg['Subject'] = subject
        
        # Convert newlines to <br> tags for HTML formatting
        html_body = body.replace('\n', '<br>')

        msg.attach(MIMEText(html_body, 'html'))

        msg['Bcc'] = ', '.join(recipients)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")

# Function to send Discord message
def send_discord_message(subject, body, webhook_url, role_mentions):
    embed = {
        "title": subject,
        "description": body,
        "color": 16753920
    }
    mentions = " ".join([f"<@&{role.role_id}>" for role in role_mentions])
    data = {
        "content": mentions,
        "embeds": [embed]
    }
    response = requests.post(webhook_url, json=data)
    if response.status_code != 204:
        raise HTTPException(status_code=500, detail=f"Failed to send message to Discord channel: {response.status_code}")

@app.post("/send_email/")
def send_email(request: models.EmailRequest, db: Session = Depends(get_db)):
    emails = crud.get_emails(db)
    recipients = [email.email for email in emails]
    
    if not recipients:
        raise HTTPException(status_code=404, detail="No recipients found")
    
    send_email_bcc(db, recipients, request.subject, request.body)
    return {"message": "Email sent successfully"}

@app.post("/send_discord/")
def send_discord(request: models.DiscordRequest, db: Session = Depends(get_db)):
    webhooks = crud.get_webhooks(db)
    active_webhooks = [webhook for webhook in webhooks if webhook.is_active]
    role_mentions = crud.get_discord_roles(db)
    active_role_mentions = [role for role in role_mentions if role.is_active]
    for webhook in active_webhooks:
        send_discord_message(request.subject, request.body, webhook.webhook_url, active_role_mentions)
    return {"message": "Discord message sent successfully"}

@app.post("/set_webhook/", response_model=schemas.Webhook)
def set_webhook(request: models.WebhookRequest, db: Session = Depends(get_db)):
    db_webhook = crud.get_webhook_by_channel_name(db, channel_name=request.channel_name)
    if db_webhook:
        raise HTTPException(status_code=400, detail="Channel name already registered")
    return crud.create_webhook(db=db, webhook=request)

@app.get("/get_webhooks/", response_model=List[schemas.Webhook])
def get_webhooks(db: Session = Depends(get_db)):
    return crud.get_webhooks(db)

@app.delete("/webhooks/{channel_name}", response_model=dict)
def delete_webhook(channel_name: str, db: Session = Depends(get_db)):
    success = crud.delete_webhook_by_channel_name(db, channel_name)
    if not success:
        raise HTTPException(status_code=404, detail="Webhook not found")
    return {"detail": "Webhook deleted successfully"}

@app.put("/update_webhook/")
def update_webhook(webhook: schemas.WebhookUpdate, db: Session = Depends(get_db)):
    db_webhook = crud.get_webhook_by_channel_name(db, channel_name=webhook.channel_name)
    if not db_webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    db_webhook.is_active = webhook.is_active
    db.commit()
    db.refresh(db_webhook)
    return db_webhook

@app.post("/add_email/")
def add_email(email: schemas.EmailCreate, db: Session = Depends(get_db)):
    # Validate email format (basic validation)
    if '@' not in email.email:
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Check if the email is in the exclusion list
    exclusion_list = crud.get_exclusion_list(db)
    exclusion_emails = {exclusion.email for exclusion in exclusion_list}
    if email.email in exclusion_emails:
        raise HTTPException(status_code=400, detail="Email is in the exclusion list")

    # Check if the email already exists in the database
    db_email = crud.get_email_by_address(db, email=email.email)
    if db_email:
        raise HTTPException(status_code=400, detail="Email already exists in the database")

    # Add the email to the database
    crud.create_email(db=db, email=email)
    return {"message": "Email added successfully"}

@app.post("/import_emails/")
def import_emails(db: Session = Depends(get_db)):
    # Fetch stored Tautulli credentials
    credentials = crud.get_tautulli_credentials(db)
    if not credentials:
        raise HTTPException(status_code=404, detail="Tautulli credentials not found")

    url = f"{credentials.base_url}/api/v2"
    params = {
        'apikey': credentials.api_key,
        'cmd': 'get_users'
    }
    response = requests.get(url, params=params)
    data = response.json()

    if data['response']['result'] == 'success':
        users = data['response']['data']
        emails = [user['email'] for user in users if user['email']]
        
        # Fetch exclusion list
        exclusion_list = crud.get_exclusion_list(db)
        exclusion_emails = {exclusion.email for exclusion in exclusion_list}

        # Store emails in the database, excluding those in the exclusion list
        for email in emails:
            if email not in exclusion_emails:
                db_email = crud.get_email_by_address(db, email=email)
                if not db_email:
                    print(f"Adding email to database: {email}")
                    crud.create_email(db=db, email=schemas.EmailCreate(email=email))
                else:
                    print(f"Email already in database: {email}")
            else:
                print(f"Email excluded: {email}")
                # Delete email from database if it exists
                db_email = crud.get_email_by_address(db, email=email)
                if db_email:
                    print(f"Deleting email from database: {email}")
                    crud.delete_email(db=db, email=email)
        
        # Fetch the updated list of emails from the database
        updated_emails = crud.get_emails(db)
        updated_email_list = [email.email for email in updated_emails]
        
        return {"emails": updated_email_list}
    else:
        raise HTTPException(status_code=500, detail="Failed to retrieve users from Tautulli")
    
@app.get("/get_emails/", response_model=List[str])
def get_emails(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    emails = crud.get_emails(db, skip=skip, limit=limit)
    return [email.email for email in emails]

@app.delete("/delete_email/{email}", response_model=bool)
def delete_email(email: str, db: Session = Depends(get_db)):
    success = crud.delete_email(db, email=email)
    if not success:
        raise HTTPException(status_code=404, detail="Email not found")
    return success
    
@app.post("/set_tautulli_credentials/", response_model=schemas.TautulliCredentials)
def set_tautulli_credentials(request: schemas.TautulliCredentialsCreate, db: Session = Depends(get_db)):
    db_credentials = crud.get_tautulli_credentials(db)
    if db_credentials:
        # Update existing credentials
        db_credentials.api_key = request.api_key
        db_credentials.base_url = request.base_url
        db.commit()
        db.refresh(db_credentials)
        return db_credentials
    else:
        # Create new credentials
        return crud.create_tautulli_credentials(db=db, credentials=request)

@app.get("/get_tautulli_credentials/", response_model=schemas.TautulliCredentials)
def get_tautulli_credentials(db: Session = Depends(get_db)):
    credentials = crud.get_tautulli_credentials(db)
    if not credentials:
        raise HTTPException(status_code=404, detail="Tautulli credentials not found")
    return credentials

@app.get("/get_exclusion_list/", response_model=List[schemas.Exclusion])
def get_exclusion_list(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_exclusion_list(db, skip=skip, limit=limit)

@app.post("/set_exclusion/", response_model=schemas.Exclusion)
def set_exclusion(request: schemas.ExclusionCreate, db: Session = Depends(get_db)):
    db_exclusion = crud.get_exclusion_by_email(db, email=request.email)
    if db_exclusion:
        raise HTTPException(status_code=400, detail="Email already in exclusion list")
    return crud.create_exclusion(db=db, exclusion=request)

@app.delete("/delete_exclusion/{email}", response_model=bool)
def delete_exclusion(email: str, db: Session = Depends(get_db)):
    success = crud.delete_exclusion(db, email=email)
    if not success:
        raise HTTPException(status_code=404, detail="Email not found in exclusion list")
    return success

@app.post("/set_email_credentials/", response_model=schemas.EmailCredentials)
def set_email_credentials(request: schemas.EmailCredentialsCreate, db: Session = Depends(get_db)):
    db_credentials = crud.get_email_credentials(db)
    if db_credentials:
        # Update existing credentials
        db_credentials.email_address = request.email_address
        db_credentials.email_password = request.email_password
        db.commit()
        db.refresh(db_credentials)
        return db_credentials
    else:
        # Create new credentials
        return crud.create_email_credentials(db=db, credentials=request)

@app.get("/get_email_credentials/", response_model=schemas.EmailCredentials)
def get_email_credentials(db: Session = Depends(get_db)):
    credentials = crud.get_email_credentials(db)
    if not credentials:
        raise HTTPException(status_code=404, detail="Email credentials not found")
    return credentials

@app.delete("/delete_email_credentials/", response_model=bool)
def delete_email_credentials(db: Session = Depends(get_db)):
    success = crud.delete_email_credentials(db)
    if not success:
        raise HTTPException(status_code=404, detail="Email credentials not found")
    return success

@app.post("/set_discord_role/", response_model=schemas.DiscordRole)
def set_discord_role(request: schemas.DiscordRoleCreate, db: Session = Depends(get_db)):
    db_discord_role = crud.get_discord_role_by_id(db, role_id=request.role_id)
    if db_discord_role:
        raise HTTPException(status_code=400, detail="Role already exists")
    return crud.create_discord_role(db=db, discord_role=request)

@app.get("/get_discord_roles/", response_model=List[schemas.DiscordRole])
def get_discord_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_discord_roles(db, skip=skip, limit=limit)

@app.delete("/delete_discord_role/{role_id}", response_model=bool)
def delete_discord_role(role_id: str, db: Session = Depends(get_db)):
    success = crud.delete_discord_role(db, role_id=role_id)
    if not success:
        raise HTTPException(status_code=404, detail="Role not found")
    return success

@app.put("/update_discord_role/", response_model=schemas.DiscordRole)
def update_discord_role(role: schemas.DiscordRoleUpdate, db: Session = Depends(get_db)):
    updated_role = crud.update_discord_role(db, role=role)
    if not updated_role:
        raise HTTPException(status_code=404, detail="Role not found")
    return updated_role

@app.post("/save_sent_message/", response_model=schemas.SentMessage)
def save_sent_message(request: schemas.SentMessageCreate, db: Session = Depends(get_db)):
    return crud.create_sent_message(db=db, sent_message=request)

@app.get("/get_sent_messages/", response_model=List[schemas.SentMessage])
def get_sent_messages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sent_messages(db, skip=skip, limit=limit)

from fastapi import HTTPException

@app.delete("/clear_sent_messages/")
def clear_sent_messages(db: Session = Depends(get_db)):
    try:
        crud.delete_all_sent_messages(db)
        return {"message": "All sent messages have been cleared."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/message_templates/", response_model=List[schemas.MessageTemplate])
def get_message_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_message_templates(db, skip=skip, limit=limit)

@app.post("/message_templates/", response_model=schemas.MessageTemplate)
def create_message_template(template: schemas.MessageTemplateCreate, db: Session = Depends(get_db)):
    return crud.create_message_template(db=db, template=template)

@app.delete("/message_templates/{template_id}", response_model=bool)
def delete_message_template(template_id: int, db: Session = Depends(get_db)):
    return crud.delete_message_template(db, template_id)