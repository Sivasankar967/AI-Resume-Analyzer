import { useState } from "react";
import { Sparkles, BriefcaseBusiness, Upload, Zap, RotateCcw } from "lucide-react";
import FileUpload from "./Components/FileUpload";
import ResultsDashboard from "./Components/ResultsDashboard";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canAnalyze = file && jobDescription.trim().length >= 20 && !loading;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setLoading(true);
    setAnalysis(null);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Analysis failed");
      }

      const result = await res.json();
      setAnalysis(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setAnalysis(null);
    setError(null);
  };

  return (
    <>
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="ambient-orb" />
        <div className="ambient-orb" />
        <div className="ambient-orb" />
      </div>

      <div className="app-container">
        {/* Hero */}
        <header className="hero-header">
          <div className="hero-icon">
            <Sparkles />
          </div>
          <h1 className="hero-title">AI Resume Analyzer</h1>
          <p className="hero-subtitle">
            Upload your resume & paste a job description — get an instant
            AI-powered match score, missing skills, and actionable tips.
          </p>
        </header>

        {/* Input Section */}
        {!analysis && !loading && (
          <>
            <div className="input-grid">
              {/* Resume Upload */}
              <div className="glass-card">
                <div className="card-header">
                  <div
                    className="card-header-icon"
                    style={{ background: "rgba(108, 92, 231, 0.15)" }}
                  >
                    <Upload style={{ color: "var(--accent-secondary)" }} />
                  </div>
                  <h2>Resume</h2>
                </div>
                <FileUpload onFileSelect={setFile} selectedFile={file} />
              </div>

              {/* Job Description */}
              <div className="glass-card">
                <div className="card-header">
                  <div
                    className="card-header-icon"
                    style={{ background: "rgba(253, 121, 168, 0.15)" }}
                  >
                    <BriefcaseBusiness
                      style={{ color: "#fd79a8" }}
                    />
                  </div>
                  <h2>Job Description</h2>
                </div>
                <textarea
                  className="job-textarea"
                  placeholder="Paste the full job description here...&#10;&#10;Example: We are looking for a Senior Frontend Developer with experience in React, TypeScript, and modern CSS..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Analyze Button */}
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
            >
              <Zap />
              Analyze Match
            </button>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="glass-card loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Analyzing your resume...</p>
            <p className="loading-text-sub">
              Gemini AI is evaluating your match — this may take a few seconds
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-card fade-in-up">
            <p>{error}</p>
            <button
              className="analyze-btn"
              style={{ marginTop: "16px" }}
              onClick={() => setError(null)}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <>
            <ResultsDashboard analysis={analysis} />
            <button
              className="analyze-btn"
              style={{ marginTop: "32px" }}
              onClick={handleReset}
            >
              <RotateCcw size={18} />
              Analyze Another Resume
            </button>
          </>
        )}
      </div>
    </>
  );
}