import os
import json
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import io

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI(title="Resume Analyzer API", version="1.0.0")

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_pdf_text(file_bytes: bytes) -> str:
    """Extract text from a PDF file."""
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()


def build_prompt(resume_text: str, job_description: str) -> str:
    """Build the analysis prompt for Gemini."""
    return f"""You are an expert AI Resume Analyzer and Career Coach.

Analyze the following resume against the provided job description. Provide a detailed, actionable analysis.

Return ONLY valid JSON (no markdown, no backticks, no explanation) with these exact keys:

{{
  "score": <number 0-100 representing how well the resume matches the job>,
  "scoreBreakdown": {{
    "skillsMatch": <number 0-100>,
    "experienceMatch": <number 0-100>,
    "educationMatch": <number 0-100>,
    "overallPresentation": <number 0-100>
  }},
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "improvements": [
    {{
      "category": "<category name like 'Experience', 'Skills', 'Format', 'Keywords'>",
      "title": "<short improvement title>",
      "description": "<detailed actionable advice>"
    }}
  ],
  "tips": [
    "<actionable tip 1>",
    "<actionable tip 2>",
    "<actionable tip 3>",
    "<actionable tip 4>",
    "<actionable tip 5>"
  ],
  "summary": "<2-3 sentence professional summary of the candidate's profile and fit for the role>",
  "experienceLevel": "<Junior/Mid/Senior/Lead based on resume>",
  "overallVerdict": "<Strong Match / Good Match / Partial Match / Weak Match>"
}}

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""


@app.get("/api")
async def root():
    return {"status": "ok", "message": "Resume Analyzer API is running"}


@app.post("/api/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    """Analyze a resume PDF against a job description using Gemini AI."""
    
    # Validate file type
    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    # Read and extract text from PDF
    file_bytes = await resume.read()
    resume_text = extract_pdf_text(file_bytes)
    
    if not resume_text or len(resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Could not extract sufficient text from the PDF. Please ensure it's a text-based PDF."
        )
    
    if not job_description or len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Please provide a more detailed job description (at least 20 characters)."
        )
    
    # Build prompt and call Gemini
    prompt = build_prompt(resume_text, job_description)
    
    try:
        response = model.generate_content(prompt)
        raw = response.text
        
        # Clean the response — remove markdown fences if present
        cleaned = raw.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        # Parse JSON
        result = json.loads(cleaned)
        return result
        
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse AI response. Please try again."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
