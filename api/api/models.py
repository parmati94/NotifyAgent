from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from .database import Base, engine
from pydantic import BaseModel

class Webhook(Base):
    __tablename__ = "webhooks"

    id = Column(Integer, primary_key=True, index=True)
    channel_name = Column(String, unique=True, index=True)
    webhook_url = Column(String)
    is_active = Column(Boolean, default=True)
    
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

class TautulliCredentials(Base):
    __tablename__ = "tautulli_credentials"

    id = Column(Integer, primary_key=True, index=True)
    api_key = Column(String, unique=True, index=True)
    base_url = Column(String)

class EmailCredentials(Base):
    __tablename__ = "email_credentials"

    id = Column(Integer, primary_key=True, index=True)
    email_address = Column(String, unique=True, index=True)
    email_password = Column(String)
    
class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    
class ExclusionList(Base):
    __tablename__ = "exclusion_list"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    
class DiscordRole(Base):
    __tablename__ = "discord_roles"

    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String, index=True)
    role_id = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    
class SentMessage(Base):
    __tablename__ = "sent_messages"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    body = Column(Text)
    services = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
class MessageTemplate(Base):
    __tablename__ = "message_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    subject = Column(String)
    body = Column(Text)

Base.metadata.create_all(bind=engine)