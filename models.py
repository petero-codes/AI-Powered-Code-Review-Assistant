from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(String, unique=True, index=True)
    username = Column(String, index=True)
    avatar_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    language = Column(String)
    original_code = Column(Text)
    review_json = Column(JSON)
    score = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PRReview(Base):
    __tablename__ = "pr_reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pr_url = Column(String)
    repo_name = Column(String)
    review_json = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
