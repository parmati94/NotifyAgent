from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class Token(BaseModel):
    token: str
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserInDB(User):
    password_hash: str

class WebhookBase(BaseModel):
    channel_name: str
    webhook_url: str
    is_active: bool

class WebhookCreate(WebhookBase):
    pass

class WebhookUpdate(BaseModel):
    channel_name: Optional[str] = None
    webhook_url: Optional[str] = None
    is_active: Optional[bool] = None

class Webhook(WebhookBase):
    id: int

    class Config:
        from_attributes = True

class TautulliCredentialsBase(BaseModel):
    api_key: str
    base_url: str

class TautulliCredentialsCreate(TautulliCredentialsBase):
    pass

class TautulliCredentials(TautulliCredentialsBase):
    id: int

    class Config:
        from_attributes = True
        
class EmailBase(BaseModel):
    email: str

class EmailCreate(EmailBase):
    pass

class Email(EmailBase):
    id: int

    class Config:
        from_attributes = True
        
class ExclusionBase(BaseModel):
    email: str

class ExclusionCreate(ExclusionBase):
    pass

class Exclusion(ExclusionBase):
    id: int

    class Config:
        from_attributes = True
        
from pydantic import BaseModel

class EmailCredentialsBase(BaseModel):
    email_address: str
    email_password: str

class EmailCredentialsCreate(EmailCredentialsBase):
    pass

class EmailCredentials(EmailCredentialsBase):
    id: int

    class Config:
        from_attributes = True
        
from pydantic import BaseModel

class DiscordRoleBase(BaseModel):
    role_name: str
    role_id: str
    is_active: bool

class DiscordRoleCreate(DiscordRoleBase):
    pass

class DiscordRoleUpdate(BaseModel):
    role_name: Optional[str] = None
    role_id: Optional[str] = None
    is_active: Optional[bool] = None

class DiscordRole(DiscordRoleBase):
    id: int

    class Config:
        from_attributes: True
        
class SentMessageBase(BaseModel):
    subject: str
    body: str
    services: str

class SentMessageCreate(SentMessageBase):
    pass

class SentMessage(SentMessageBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes: True

class MessageTemplateBase(BaseModel):
    name: str
    subject: str
    body: str

class MessageTemplateCreate(MessageTemplateBase):
    pass

class MessageTemplate(MessageTemplateBase):
    id: int

    class Config:
        from_attributes = True