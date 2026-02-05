from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import Base, engine
from app.routes import health, profile

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Me API Playground",
    description="Personal API for profile management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(profile.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Me API Playground",
        "docs": "/docs",
        "health": "/health",
        "profile": "/profile"
    }
