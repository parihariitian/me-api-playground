from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.models.profile import Profile as ProfileModel
from datetime import datetime

router = APIRouter(prefix="/profile", tags=["Profile"])

# Pydantic models
class ProfileCreate(BaseModel):
    name: str
    email: str
    phone: str
    bio: str
    skills: str

class ProfileUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    bio: str | None = None
    skills: str | None = None

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    bio: str
    skills: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SkillCount(BaseModel):
    skill: str
    count: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET - सभ profiles
@router.get("/", response_model=list[ProfileResponse])
def get_all_profiles(db: Session = Depends(get_db)):
    profiles = db.query(ProfileModel).all()
    return profiles

# GET - Profile search by name or email
@router.get("/search", response_model=list[ProfileResponse])
def search_profile(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    """Search profiles by name, email, or skills"""
    search_term = f"%{q}%"
    profiles = db.query(ProfileModel).filter(
        (ProfileModel.name.ilike(search_term)) |
        (ProfileModel.email.ilike(search_term)) |
        (ProfileModel.skills.ilike(search_term))
    ).all()
    return profiles

# GET - Top skills used in profiles
@router.get("/skills/top", response_model=list[SkillCount])
def get_top_skills(limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db)):
    """Get top skills across all profiles"""
    profiles = db.query(ProfileModel).all()
    skill_count = {}
    
    for profile in profiles:
        if profile.skills:
            # Split skills by comma and count
            skills = [s.strip() for s in profile.skills.split(",")]
            for skill in skills:
                skill_count[skill] = skill_count.get(skill, 0) + 1
    
    # Sort by count and return top N
    top_skills = sorted(skill_count.items(), key=lambda x: x[1], reverse=True)[:limit]
    return [SkillCount(skill=skill, count=count) for skill, count in top_skills]

# GET - एक profile by ID
@router.get("/{profile_id}", response_model=ProfileResponse)
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(ProfileModel).filter(ProfileModel.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

# POST - नय profile create कर
@router.post("/", response_model=ProfileResponse, status_code=201)
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    existing = db.query(ProfileModel).filter(ProfileModel.email == profile.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_profile = ProfileModel(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# PUT - profile update 
@router.put("/{profile_id}", response_model=ProfileResponse)
def update_profile(profile_id: int, profile: ProfileUpdate, db: Session = Depends(get_db)):
    db_profile = db.query(ProfileModel).filter(ProfileModel.id == profile_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = profile.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_profile, field, value)
    
    db_profile.updated_at = datetime.utcnow()
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# DELETE - profile delete कर
@router.delete("/{profile_id}")
def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    db_profile = db.query(ProfileModel).filter(ProfileModel.id == profile_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db.delete(db_profile)
    db.commit()
    return {"message": "Profile deleted successfully"}


