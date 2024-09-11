from sqlalchemy import Column, Integer, String
from .database import Base, engine

class Webhook(Base):
    __tablename__ = "webhooks"

    id = Column(Integer, primary_key=True, index=True)
    channel_name = Column(String, unique=True, index=True)
    webhook_url = Column(String)

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

Base.metadata.create_all(bind=engine)