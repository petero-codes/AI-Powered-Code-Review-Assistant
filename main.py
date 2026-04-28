from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas
from database import engine, get_db
from services.ai_reviewer import analyze_code
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Powered Code Review Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API is running"}

@app.post("/api/review", response_model=schemas.ReviewResponse)
async def create_review(request: schemas.ReviewRequest, db: Session = Depends(get_db)):
    # Mock user for now
    mock_user_id = 1
    user = db.query(models.User).filter(models.User.id == mock_user_id).first()
    if not user:
        user = models.User(github_id="mock_git_id", username="MockUser", avatar_url="https://github.com/github.png")
        db.add(user)
        db.commit()
        db.refresh(user)

    review_result = await analyze_code(request.code, request.language)

    db_review = models.Review(
        user_id=user.id,
        language=request.language,
        original_code=request.code,
        review_json=review_result,
        score=review_result.get("score", 0)
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    return db_review

@app.get("/api/history", response_model=List[schemas.ReviewResponse])
def get_history(db: Session = Depends(get_db)):
    reviews = db.query(models.Review).order_by(models.Review.created_at.desc()).all()
    return reviews

@app.get("/api/review/{review_id}", response_model=schemas.ReviewResponse)
def get_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@app.delete("/api/review/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"status": "deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

