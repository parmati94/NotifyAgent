from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
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
from . import models, schemas, crud
from .database import SessionLocal, engine

app = FastAPI()

load_dotenv()

models.Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Models
class EmailRequest(BaseModel):
    subject: str
    body: str

class WebhookRequest(BaseModel):
    channel_name: str
    webhook_url: str

class TautulliRequest(BaseModel):
    api_key: str
    base_url: str
    
class DiscordRequest(BaseModel):
    subject: str
    body: str

FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')


app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

        msg.attach(MIMEText(body, 'html'))

        msg['Bcc'] = ', '.join(recipients)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")

# Function to send Discord message
def send_discord_message(subject, body, webhook_url):
    embed = {
        "title": subject,
        "description": body,
        "color": 16753920
    }
    data = {
        "content": "",
        "embeds": [embed]
    }
    response = requests.post(webhook_url, json=data)
    if response.status_code != 204:
        raise HTTPException(status_code=500, detail=f"Failed to send message to Discord channel: {response.status_code}")

@app.post("/send_email/")
def send_email(request: EmailRequest, db: Session = Depends(get_db)):
    emails = crud.get_emails(db)
    recipients = [email.email for email in emails]
    
    if not recipients:
        raise HTTPException(status_code=404, detail="No recipients found")
    
    send_email_bcc(db, recipients, request.subject, request.body)
    return {"message": "Email sent successfully"}

@app.post("/send_discord/")
def send_discord(request: DiscordRequest, db: Session = Depends(get_db)):
    webhooks = crud.get_webhooks(db)
    for webhook in webhooks:
        send_discord_message(request.subject, request.body, webhook.webhook_url)
    return {"message": "Discord message sent successfully"}

@app.post("/set_webhook/", response_model=schemas.Webhook)
def set_webhook(request: WebhookRequest, db: Session = Depends(get_db)):
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