# Me API Playground 🚀

A personal profile management API with a modern web UI.

## Features

✨ **API Features:**
- Create, Read, Update, Delete profiles
- Search profiles by name, email, or skills
- Get top skills across all profiles
- CORS enabled for frontend access

🎨 **Frontend Features:**
- Beautiful responsive UI
- Profile management interface
- Real-time search
- Skills analytics

## Project Structure

```
me-api-playground/
├── backend/
│   ├── app/
│   │   ├── core/       # Database configuration
│   │   ├── models/     # SQLAlchemy models
│   │   ├── routes/     # API routes
│   │   ├── main.py     # FastAPI app
│   │   └── seed.py     # Sample data
│   ├── requirements.txt
│   └── me.db          # SQLite database
│
└── frontend/
    ├── index.html      # Main HTML
    ├── style.css       # Styling
    └── script.js       # JavaScript logic
```

## Live Demo

🌍 **Backend API:** [Render URL will be here]
🌍 **Frontend:** [Render URL will be here]

## Local Development

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m app.seed           # Load sample data
python -m uvicorn app.main:app --reload
```

Access API at: `http://127.0.0.1:8000`
API Docs: `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd frontend
python -m http.server 3000
```

Access at: `http://127.0.0.1:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check |
| GET | `/profile` | Get all profiles |
| POST | `/profile` | Create new profile |
| GET | `/profile/{id}` | Get profile by ID |
| PUT | `/profile/{id}` | Update profile |
| DELETE | `/profile/{id}` | Delete profile |
| GET | `/profile/search?q=...` | Search profiles |
| GET | `/profile/skills/top?limit=10` | Get top skills |

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** Render

## Author

Sanjay Parihar
resume link : https://drive.google.com/file/d/1zLL0anGtUIxjLneYMbVxr6xruM1Z9yAG/view?usp=sharing
