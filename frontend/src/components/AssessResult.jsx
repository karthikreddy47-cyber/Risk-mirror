import RiskGauge from './RiskGauge';
import './AssessResult.css';

export default function AssessResult({ result, onNew, onDashboard }) {
  const { risk_category, overall_score, risk_factors, recommendations, score_breakdown } = result;

  const catColor = risk_category === 'Low Risk' ? 'var(--green)'
    : risk_category === 'Moderate Risk' ? 'var(--amber)'
    : 'var(--accent)';

  const catBg = risk_category === 'Low Risk' ? 'var(--green-light)'
    : risk_category === 'Moderate Risk' ? 'var(--amber-light)'
    : 'var(--accent-light)';

  const catEmoji = risk_category === 'Low Risk' ? '✅'
    : risk_category === 'Moderate Risk' ? '⚠️'
    : '🔴';

  const breakdownItems = [
    { label: 'Savings', score: score_breakdown?.savings, max: 20 },
    { label: 'Expenses', score: score_breakdown?.expenses, max: 15 },
    { label: 'Debt Level', score: score_breakdown?.debt, max: 20 },
    { label: 'EMI Burden', score: score_breakdown?.emi, max: 15 },
    { label: 'Emergency Fund', score: score_breakdown?.emergency, max: 15 },
    { label: 'Investments', score: score_breakdown?.investment, max: 10 },
    { label: 'Income Stability', score: score_breakdown?.stability, max: 5 },
  ];

  return (
    <div className="result-page">
      <div className="result-hero fadeUp">
        <div className="result-hero-inner">
          <div className="result-badge" style={{ background: catBg, color: catColor }}>
            {catEmoji} {risk_category}
          </div>
          <h1>Your Financial Risk Profile</h1>
          <p>Based on your financial data, here's your personalized risk assessment</p>
        </div>
      </div>

      <div className="result-grid">
        {/* Score card */}
        <div className="result-score-card fadeUp fadeUp-1">
          <div className="result-score-title">Overall Risk Score</div>
          <RiskGauge score={overall_score} category={risk_category} />
          <div className="result-score-interpretation" style={{ background: catBg, color: catColor }}>
            {risk_category === 'Low Risk' && 'Your finances are in good shape. Keep maintaining these healthy habits.'}
            {risk_category === 'Moderate Risk' && 'There are areas of concern. Targeted improvements can significantly reduce your risk.'}
            {risk_category === 'High Risk' && 'Your finances show significant vulnerabilities. Immediate action is recommended.'}
          </div>
        </div>

        {/* Breakdown */}
        <div className="result-breakdown-card fadeUp fadeUp-2">
          <div className="result-section-title">Score Breakdown</div>
          <div className="breakdown-list">
            {breakdownItems.map(({ label, score, max }) => {
              const pct = max > 0 ? (score / max) * 100 : 0;
              const color = pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--amber)' : 'var(--accent)';
              return (
                <div className="breakdown-item" key={label}>
                  <div className="breakdown-header">
                    <span className="breakdown-label">{label}</span>
                    <span className="breakdown-score" style={{ color }}>{score}/{max}</span>
                  </div>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk factors */}
        {risk_factors?.length > 0 && (
          <div className="result-factors-card fadeUp fadeUp-3">
            <div className="result-section-title">Risk Factors Identified</div>
            <div className="result-factors">
              {risk_factors.map((f, i) => (
                <div key={i} className={`result-factor severity-${f.severity}`}>
                  <div className="rf-severity">{f.severity}</div>
                  <div className="rf-content">
                    <div className="rf-label">{f.label}</div>
                    <div className="rf-val">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="result-recs-card fadeUp fadeUp-4">
            <div className="result-section-title">Action Plan</div>
            <div className="result-recs">
              {recommendations.map((r, i) => (
                <div key={i} className="result-rec">
                  <div className="rec-bullet" style={{ background: catColor }}>{i + 1}</div>
                  <div className="result-rec-text">{r}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="result-actions fadeUp fadeUp-4">
        <button className="result-btn-secondary" onClick={onNew}>
          + New Assessment
        </button>
        <button className="result-btn-primary" onClick={onDashboard}>
          View Dashboard →
        </button>
      </div>
    </div>
  );
}
