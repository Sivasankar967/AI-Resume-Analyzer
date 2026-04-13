import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";

function ScoreRing({ score }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return "#00b894";
    if (score >= 60) return "#fdcb6e";
    return "#e17055";
  };

  return (
    <div className="score-ring-container">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle className="score-ring-bg" cx="80" cy="80" r={radius} />
        <circle
          className="score-ring-fill"
          cx="80"
          cy="80"
          r={radius}
          stroke={getScoreColor()}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-value">
        <div className="score-number" style={{ color: getScoreColor() }}>
          {score}
        </div>
        <div className="score-label">Match Score</div>
      </div>
    </div>
  );
}

function BreakdownBar({ label, value }) {
  const getColor = () => {
    if (value >= 80) return "#00b894";
    if (value >= 60) return "#fdcb6e";
    return "#e17055";
  };

  return (
    <div className="breakdown-item">
      <div className="breakdown-label">{label}</div>
      <div className="breakdown-bar">
        <div
          className="breakdown-fill"
          style={{ width: `${value}%`, background: getColor() }}
        />
      </div>
      <div className="breakdown-value" style={{ color: getColor() }}>
        {value}%
      </div>
    </div>
  );
}

function VerdictBadge({ verdict }) {
  const getStyle = () => {
    if (verdict?.includes("Strong"))
      return { bg: "var(--color-success-bg)", color: "var(--color-success)", border: "var(--color-success-border)" };
    if (verdict?.includes("Good"))
      return { bg: "var(--color-info-bg)", color: "var(--color-info)", border: "var(--color-info-border)" };
    if (verdict?.includes("Partial"))
      return { bg: "var(--color-warning-bg)", color: "var(--color-warning)", border: "var(--color-warning-border)" };
    return { bg: "var(--color-danger-bg)", color: "var(--color-danger)", border: "var(--color-danger-border)" };
  };

  const s = getStyle();
  return (
    <div
      className="verdict-badge"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      <Award size={16} />
      {verdict}
    </div>
  );
}

export default function ResultsDashboard({ analysis }) {
  return (
    <div className="results-grid">
      {/* Score Card */}
      <div className="score-card fade-in-up">
        <VerdictBadge verdict={analysis.overallVerdict} />
        <ScoreRing score={parseInt(analysis.score) || 0} />

        {analysis.scoreBreakdown && (
          <div className="score-breakdown">
            <BreakdownBar
              label="Skills"
              value={analysis.scoreBreakdown.skillsMatch || 0}
            />
            <BreakdownBar
              label="Experience"
              value={analysis.scoreBreakdown.experienceMatch || 0}
            />
            <BreakdownBar
              label="Education"
              value={analysis.scoreBreakdown.educationMatch || 0}
            />
            <BreakdownBar
              label="Presentation"
              value={analysis.scoreBreakdown.overallPresentation || 0}
            />
          </div>
        )}
      </div>

      {/* Matched Skills */}
      {analysis.matchedSkills?.length > 0 && (
        <div className="glass-card fade-in-up">
          <div className="card-header">
            <div
              className="card-header-icon"
              style={{ background: "var(--color-success-bg)" }}
            >
              <CheckCircle style={{ color: "var(--color-success)" }} />
            </div>
            <h3>Matched Skills</h3>
          </div>
          <div className="skills-grid">
            {analysis.matchedSkills.map((skill, i) => (
              <span key={i} className="skill-tag matched">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {analysis.missingSkills?.length > 0 && (
        <div className="glass-card fade-in-up">
          <div className="card-header">
            <div
              className="card-header-icon"
              style={{ background: "var(--color-danger-bg)" }}
            >
              <AlertCircle style={{ color: "var(--color-danger)" }} />
            </div>
            <h3>Missing Skills</h3>
          </div>
          <div className="skills-grid">
            {analysis.missingSkills.map((skill, i) => (
              <span key={i} className="skill-tag missing">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {analysis.improvements?.length > 0 && (
        <div className="glass-card fade-in-up">
          <div className="card-header">
            <div
              className="card-header-icon"
              style={{ background: "var(--color-warning-bg)" }}
            >
              <Zap style={{ color: "var(--color-warning)" }} />
            </div>
            <h3>Areas for Improvement</h3>
          </div>
          <div className="improvements-list">
            {analysis.improvements.map((item, i) => (
              <div key={i} className="improvement-card">
                <div className="improvement-category">{item.category}</div>
                <div className="improvement-title">{item.title}</div>
                <div className="improvement-desc">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {analysis.tips?.length > 0 && (
        <div className="glass-card fade-in-up">
          <div className="card-header">
            <div
              className="card-header-icon"
              style={{ background: "var(--color-info-bg)" }}
            >
              <Lightbulb style={{ color: "var(--color-info)" }} />
            </div>
            <h3>Pro Tips</h3>
          </div>
          <div className="tips-list">
            {analysis.tips.map((tip, i) => (
              <div key={i} className="tip-item">
                <div className="tip-number">{i + 1}</div>
                <div className="tip-text">{tip}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {analysis.summary && (
        <div className="summary-card fade-in-up">
          <div className="card-header">
            <Sparkles size={22} style={{ color: "white" }} />
            <h3>Professional Summary</h3>
          </div>
          <p className="summary-text">{analysis.summary}</p>
          {analysis.experienceLevel && (
            <div className="experience-badge">
              <TrendingUp size={14} />
              {analysis.experienceLevel} Level
            </div>
          )}
        </div>
      )}
    </div>
  );
}
