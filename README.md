# 🤖 AI Resume Analyzer

An AI-powered resume analysis tool that matches your resume against job descriptions using **Google Gemini AI**. Upload a resume PDF, paste a job description, and get an instant match score with actionable improvement tips.

![AI Resume Analyzer](https://img.shields.io/badge/AI-Resume%20Analyzer-6c5ce7?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5-4285F4?style=for-the-badge&logo=google)

---

## ✨ Features

- 📄 **PDF Resume Upload** — Drag-and-drop or click to upload your resume
- 📝 **Job Description Input** — Paste any job listing for targeted analysis
- 📊 **Match Score** — Get a 0–100 score with detailed breakdown (Skills, Experience, Education, Presentation)
- ✅ **Matched Skills** — See which of your skills align with the job
- ❌ **Missing Skills** — Identify skill gaps you need to fill
- 💡 **Improvement Tips** — Actionable advice to strengthen your resume
- 🎯 **Overall Verdict** — Strong Match / Good Match / Partial Match / Weak Match
- 🌙 **Premium Dark UI** — Glassmorphism design with smooth animations

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Python, FastAPI, Uvicorn |
| **AI Model** | Google Gemini 2.5 Flash |
| **PDF Processing** | PyPDF2 |
| **Frontend** | React 19, Vite 7 |
| **Styling** | Vanilla CSS (Glassmorphism Dark Theme) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
Resume-Analyzer/
├── backend/                  # FastAPI Backend
│   ├── main.py               # API server + Gemini integration
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Gemini API key (not committed)
│
├── ai-resume-analyzer/       # React Frontend
│   ├── src/
│   │   ├── App.jsx           # Main app — upload + job desc + results
│   │   ├── index.css         # Premium dark design system
│   │   ├── main.jsx          # React entry point
│   │   └── Components/
│   │       ├── FileUpload.jsx        # Drag-and-drop PDF upload
│   │       └── ResultsDashboard.jsx  # Score ring, skills, tips
│   ├── index.html            # HTML entry with SEO meta
│   ├── .env                  # Backend URL config
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Gemini API Key** — Get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Resume-Analyzer.git
cd Resume-Analyzer
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Add your Gemini API key
# Edit .env and set: GEMINI_API_KEY=your_key_here

# Start the server
python -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

### 3. Setup Frontend

```bash
cd ai-resume-analyzer

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/analyze` | Analyze resume vs job description |

### POST `/analyze`

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `resume` | File (PDF) | Resume PDF file |
| `job_description` | String | Job description text |

**Response:** JSON
```json
{
  "score": 78,
  "scoreBreakdown": {
    "skillsMatch": 85,
    "experienceMatch": 70,
    "educationMatch": 80,
    "overallPresentation": 75
  },
  "matchedSkills": ["React", "JavaScript", "CSS"],
  "missingSkills": ["TypeScript", "GraphQL"],
  "improvements": [
    {
      "category": "Skills",
      "title": "Add TypeScript",
      "description": "The job requires TypeScript experience..."
    }
  ],
  "tips": ["Quantify achievements with metrics..."],
  "summary": "Strong frontend developer with...",
  "experienceLevel": "Mid",
  "overallVerdict": "Good Match"
}
```

---

## 🎨 Screenshots

### Home Page
Premium dark-themed UI with glassmorphism cards, drag-and-drop upload, and job description input.

### Analysis Results
Animated score ring, color-coded skill tags, improvement cards, and actionable pro tips.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (`ai-resume-analyzer/.env`)
```
VITE_API_URL=http://localhost:8000
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋 Author

**Siva Sankar** — [GitHub](https://github.com/your-username)

---

<p align="center">
  Built with ❤️ using FastAPI + React + Gemini AI
</p>
