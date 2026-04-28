from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

class UserBase(BaseModel):
    github_id: str
    username: str
    avatar_url: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ReviewRequest(BaseModel):
    code: str
    language: str

class PROAuthRequest(BaseModel):
    pr_url: str

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    language: str
    original_code: str
    review_json: dict
    score: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
