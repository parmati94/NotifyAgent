from pydantic import BaseModel

class WebhookBase(BaseModel):
    channel_name: str
    webhook_url: str

class WebhookCreate(WebhookBase):
    pass

class Webhook(WebhookBase):
    id: int

    class Config:
        orm_mode = True

class TautulliCredentialsBase(BaseModel):
    api_key: str
    base_url: str

class TautulliCredentialsCreate(TautulliCredentialsBase):
    pass

class TautulliCredentials(TautulliCredentialsBase):
    id: int

    class Config:
        orm_mode = True
        
class EmailBase(BaseModel):
    email: str

class EmailCreate(EmailBase):
    pass

class Email(EmailBase):
    id: int

    class Config:
        orm_mode = True
        
class ExclusionBase(BaseModel):
    email: str

class ExclusionCreate(ExclusionBase):
    pass

class Exclusion(ExclusionBase):
    id: int

    class Config:
        orm_mode = True
        
from pydantic import BaseModel

class EmailCredentialsBase(BaseModel):
    email_address: str
    email_password: str

class EmailCredentialsCreate(EmailCredentialsBase):
    pass

class EmailCredentials(EmailCredentialsBase):
    id: int

    class Config:
        orm_mode = True