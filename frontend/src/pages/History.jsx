import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './History.css';

export default function History() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/risk/history?limit=20')
      .then(r => setAssessments(r.data.assessments || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartData = [...assessments]
    .reverse()
    .map((a, i) => ({
      name: `#${i + 1}`,
      score: parseFloat(a.overall_score),
      date: new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }));

  const catColor = cat =>
    cat === 'Low Risk' ? 'var(--green)' :
    cat === 'Moderate Risk' ? 'var(--amber)' :
    'var(--accent)';

  const catBg = cat =>
    cat === 'Low Risk' ? 'var(--green-light)' :
    cat === 'Moderate Risk' ? 'var(--amber-light)' :
    'var(--accent-light)';

  if (loading) {
    return (
      <div className="history-loading">
        <div className="loading-spinner" />
        <p>Loading your history…</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header fadeUp">
        <h1>Assessment History</h1>
        <p className="history-sub">Track your financial risk over time</p>
      </div>

      {assessments.length === 0 ? (
        <div className="history-empty fadeUp">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2>No history yet</h2>
          <p>Complete your first assessment to start tracking your financial risk journey.</p>
        </div>
      ) : (
        <>
          {/* Score trend chart */}
          {assessments.length > 1 && (
            <div className="trend-card fadeUp fadeUp-1">
              <div className="trend-title">Risk Score Trend</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,15,17,0.07)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(15,15,17,0.4)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'rgba(15,15,17,0.4)' }} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid rgba(15,15,17,0.12)', borderRadius: 8, fontSize: 13 }}
                    formatter={(val) => [`${val}/100`, 'Score']}
                    labelFormatter={(label) => `Assessment: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Assessment list */}
          <div className="history-list fadeUp fadeUp-2">
            {assessments.map((a, i) => (
              <div key={a.id} className="history-item">
                <div
                  className="history-item-header"
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                >
                  <div className="hi-left">
                    <div className="hi-num">#{assessments.length - i}</div>
                    <div>
                      <div className="hi-date">
                        {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="hi-time">
                        {new Date(a.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="hi-center">
                    <span className="hi-badge" style={{ background: catBg(a.risk_category), color: catColor(a.risk_category) }}>
                      {a.risk_category}
                    </span>
                  </div>
                  <div className="hi-right">
                    <div className="hi-score" style={{ color: catColor(a.risk_category) }}>{parseFloat(a.overall_score).toFixed(0)}</div>
                    <div className="hi-score-label">/ 100</div>
                    <div className="expand-arrow">{expanded === a.id ? '▲' : '▼'}</div>
                  </div>
                </div>

                {expanded === a.id && (
                  <div className="history-item-detail">
                    <div className="detail-grid">
                      <div className="detail-section">
                        <div className="detail-heading">Financial Ratios</div>
                        {[
                          { l: 'Savings Rate', v: a.savings_ratio + '%' },
                          { l: 'Expense Ratio', v: a.expense_ratio + '%' },
                          { l: 'EMI Burden', v: a.emi_to_income_ratio + '%' },
                          { l: 'Debt-to-Income', v: a.debt_to_income_ratio + '%' },
                          { l: 'Emergency Fund', v: parseFloat(a.emergency_fund_months).toFixed(1) + ' months' },
                          { l: 'Investment Rate', v: a.investment_ratio + '%' },
                        ].map(({ l, v }) => (
                          <div className="detail-row" key={l}>
                            <span>{l}</span>
                            <strong>{v}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="detail-section">
                        <div className="detail-heading">Financial Input</div>
                        {[
                          { l: 'Monthly Income', v: '₹' + parseFloat(a.monthly_income).toLocaleString('en-IN') },
                          { l: 'Monthly Expenses', v: '₹' + parseFloat(a.monthly_expenses).toLocaleString('en-IN') },
                          { l: 'Monthly Savings', v: '₹' + parseFloat(a.monthly_savings).toLocaleString('en-IN') },
                          { l: 'Total Debt', v: '₹' + parseFloat(a.total_debt).toLocaleString('en-IN') },
                          { l: 'Monthly EMI', v: '₹' + parseFloat(a.monthly_emi).toLocaleString('en-IN') },
                          { l: 'Emergency Fund', v: '₹' + parseFloat(a.emergency_fund).toLocaleString('en-IN') },
                        ].map(({ l, v }) => (
                          <div className="detail-row" key={l}>
                            <span>{l}</span>
                            <strong>{v}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {a.recommendations?.length > 0 && (
                      <div className="detail-recs">
                        <div className="detail-heading">Recommendations</div>
                        <ul>
                          {a.recommendations.map((r, ri) => <li key={ri}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
