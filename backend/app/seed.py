from app.core.db import SessionLocal, engine, Base
from app.models.profile import Profile

Base.metadata.create_all(bind=engine)

def seed_profiles():
    db = SessionLocal()
    
    profiles = [
        {
            "name": "Sanjay Parihar",
            "email": "sanjay@example.com",
            "phone": "+91 9876543210",
            "bio": "Full Stack Developer with 5 years of experience",
            "skills": "Python, FastAPI, React, JavaScript, PostgreSQL"
        },
        {
            "name": "Raj Kumar",
            "email": "raj@example.com",
            "phone": "+91 8765432109",
            "bio": "Backend Developer specializing in cloud services",
            "skills": "Python, Django, PostgreSQL, Docker, Kubernetes"
        },
        {
            "name": "Priya Singh",
            "email": "priya@example.com",
            "phone": "+91 7654321098",
            "bio": "Frontend Developer passionate about UI/UX",
            "skills": "React, JavaScript, HTML, CSS, TypeScript, Vue.js"
        },
        {
            "name": "Amit Verma",
            "email": "amit@example.com",
            "phone": "+91 6543210987",
            "bio": "DevOps Engineer with AWS expertise",
            "skills": "Docker, Kubernetes, Python, AWS, Jenkins"
        },
        {
            "name": "Neha Sharma",
            "email": "neha@example.com",
            "phone": "+91 5432109876",
            "bio": "Data Engineer and ML enthusiast",
            "skills": "Python, SQL, Machine Learning, Apache Spark, Pandas"
        }
    ]
    
    for profile_data in profiles:
        existing = db.query(Profile).filter(Profile.email == profile_data["email"]).first()
        if not existing:
            profile = Profile(**profile_data)
            db.add(profile)
    
    db.commit()
    print(" Seed data added successfully!")
    db.close()

if __name__ == "__main__":
    seed_profiles()
