from sqlalchemy.orm import Session
from . import models, schemas

def get_webhooks(db: Session):
    return db.query(models.Webhook).all()

def get_webhook_by_channel_name(db: Session, channel_name: str):
    return db.query(models.Webhook).filter(models.Webhook.channel_name == channel_name).first()

def create_webhook(db: Session, webhook: schemas.WebhookCreate):
    db_webhook = models.Webhook(channel_name=webhook.channel_name, webhook_url=webhook.webhook_url)
    db.add(db_webhook)
    db.commit()
    db.refresh(db_webhook)
    return db_webhook

def delete_webhook_by_channel_name(db: Session, channel_name: str):
    db_webhook = db.query(models.Webhook).filter(models.Webhook.channel_name == channel_name).first()
    if db_webhook:
        db.delete(db_webhook)
        db.commit()
        return True
    return False

def get_tautulli_credentials(db: Session):
    return db.query(models.TautulliCredentials).first()

def create_tautulli_credentials(db: Session, credentials: schemas.TautulliCredentialsCreate):
    db_credentials = models.TautulliCredentials(api_key=credentials.api_key, base_url=credentials.base_url)
    db.add(db_credentials)
    db.commit()
    db.refresh(db_credentials)
    return db_credentials

def get_emails(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Email).offset(skip).limit(limit).all()

def create_email(db: Session, email: schemas.EmailCreate):
    db_email = models.Email(email=email.email)
    db.add(db_email)
    db.commit()
    db.refresh(db_email)
    return db_email

def delete_email(db: Session, email: str):
    db_email = get_email_by_address(db, email)
    if db_email:
        db.delete(db_email)
        db.commit()
        print(f"Email deleted from database: {email}")
        return True
    return False

def get_email_by_address(db: Session, email: str):
    return db.query(models.Email).filter(models.Email.email == email).first()

def get_exclusion_list(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ExclusionList).offset(skip).limit(limit).all()

def get_exclusion_by_email(db: Session, email: str):
    return db.query(models.ExclusionList).filter(models.ExclusionList.email == email).first()

def create_exclusion(db: Session, exclusion: schemas.ExclusionCreate):
    db_exclusion = models.ExclusionList(email=exclusion.email)
    db.add(db_exclusion)
    db.commit()
    db.refresh(db_exclusion)
    return db_exclusion

def delete_exclusion(db: Session, email: str):
    db_exclusion = get_exclusion_by_email(db, email)
    if db_exclusion:
        db.delete(db_exclusion)
        db.commit()
        return True
    return False

def get_email_credentials(db: Session):
    return db.query(models.EmailCredentials).first()

def create_email_credentials(db: Session, credentials: schemas.EmailCredentialsCreate):
    db_credentials = models.EmailCredentials(email_address=credentials.email_address, email_password=credentials.email_password)
    db.add(db_credentials)
    db.commit()
    db.refresh(db_credentials)
    return db_credentials

def delete_email_credentials(db: Session):
    db_credentials = db.query(models.EmailCredentials).first()
    if db_credentials:
        db.delete(db_credentials)
        db.commit()
        return True
    return False