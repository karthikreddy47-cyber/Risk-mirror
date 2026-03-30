import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import RiskGauge from '../components/RiskGauge';
import RatioBar from '../components/RatioBar';
import AIExplanation from '../components/AIExplanation';
import AIChat from '../components/AIChat';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latest, setLatest] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, statsRes] = await Promise.all([
          api.get('/risk/latest'),
          api.get('/risk/stats'),
        ]);
        setLatest(latestRes.data.assessment);
        setStats(statsRes.data.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const riskColor = (cat) => {
    if (cat === 'Low Risk') return 'var(--green)';
    if (cat === 'Moderate Risk') return 'var(--amber)';
    return 'var(--accent)';
  };

  const riskBg = (cat) => {
    if (cat === 'Low Risk') return 'var(--green-light)';
    if (cat === 'Moderate Risk') return 'var(--amber-light)';
    return 'var(--accent-light)';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading your financial profile…</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header fadeUp">
        <div>
          <h1>Good {getGreeting()}, {user?.name?.split(' ')[0]}</h1>
          <p className="header-sub">Here's your financial risk overview</p>
        </div>
        <button className="new-assess-btn" onClick={() => navigate('/assess')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Assessment
        </button>
      </div>

      {!latest ? (
        <div className="empty-state fadeUp fadeUp-1">
          <div className="empty-icon">📊</div>
          <h2>No assessments yet</h2>
          <p>Run your first financial risk assessment to see your personalized profile and insights.</p>
          <button className="empty-btn" onClick={() => navigate('/assess')}>Get Started →</button>
        </div>
      ) : (
        <>
          {/* Top row */}
          <div className="top-row fadeUp fadeUp-1">
            {/* Risk Score Card */}
            <div className="score-card">
              <div className="score-card-header">
                <span className="card-label">Current Risk Score</span>
                <span className="risk-badge" style={{ background: riskBg(latest.risk_category), color: riskColor(latest.risk_category) }}>
                  {latest.risk_category}
                </span>
              </div>
              <RiskGauge score={latest.overall_score} category={latest.risk_category} />
              <p className="score-date">Last assessed: {new Date(latest.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>

            {/* Stats mini */}
            <div className="stats-col">
              <div className="stat-mini">
                <div className="stat-mini-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>🏦</div>
                <div>
                  <div className="stat-mini-val">{stats?.total_assessments || 0}</div>
                  <div className="stat-mini-label">Total Assessments</div>
                </div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold)' }}>📈</div>
                <div>
                  <div className="stat-mini-val">{parseFloat(stats?.best_score || 0).toFixed(0)}</div>
                  <div className="stat-mini-label">Best Score</div>
                </div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>📉</div>
                <div>
                  <div className="stat-mini-val">{parseFloat(stats?.avg_score || 0).toFixed(1)}</div>
                  <div className="stat-mini-label">Average Score</div>
                </div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-icon" style={{ background: 'var(--paper-dark)', color: 'var(--ink)' }}>👥</div>
                <div>
                  <div className="stat-mini-val">{latest.dependents}</div>
                  <div className="stat-mini-label">Dependents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Ratios */}
          <div className="section-title fadeUp fadeUp-2">Financial Ratio Breakdown</div>
          <div className="ratios-grid fadeUp fadeUp-2">
            <RatioBar label="Savings Rate" value={latest.savings_ratio} good={20} warn={10} unit="%" inverse={false} desc="% of income saved monthly" />
            <RatioBar label="Expense Ratio" value={latest.expense_ratio} good={60} warn={75} unit="%" inverse={true} desc="% of income spent on expenses" />
            <RatioBar label="EMI Burden" value={latest.emi_to_income_ratio} good={20} warn={30} unit="%" inverse={true} desc="% of income going to EMIs" />
            <RatioBar label="Debt-to-Income" value={latest.debt_to_income_ratio} good={15} warn={30} unit="%" inverse={true} desc="Total debt vs annual income" />
            <RatioBar label="Emergency Fund" value={latest.emergency_fund_months} good={6} warn={3} unit=" mo" inverse={false} desc="Months of expenses covered" />
            <RatioBar label="Investment Rate" value={latest.investment_ratio} good={10} warn={5} unit="%" inverse={false} desc="% of income invested monthly" />
          </div>

          {/* Risk factors & Recommendations */}
          <div className="bottom-row fadeUp fadeUp-3">
            {/* Risk Factors */}
            {latest.risk_factors?.length > 0 && (
              <div className="factors-card">
                <div className="card-heading">Risk Factors</div>
                <div className="factors-list">
                  {latest.risk_factors.map((f, i) => (
                    <div key={i} className={`factor-item severity-${f.severity}`}>
                      <div className="factor-dot" />
                      <div className="factor-content">
                        <span className="factor-label">{f.label}</span>
                        <span className="factor-val">{f.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {latest.recommendations?.length > 0 && (
              <div className="recs-card">
                <div className="card-heading">Recommendations</div>
                <div className="recs-list">
                  {latest.recommendations.map((r, i) => (
                    <div key={i} className="rec-item">
                      <span className="rec-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="rec-text">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Financial snapshot */}
          <div className="snapshot-grid fadeUp fadeUp-4">
            {[
              { label: 'Monthly Income', val: latest.monthly_income, prefix: '₹' },
              { label: 'Monthly Expenses', val: latest.monthly_expenses, prefix: '₹' },
              { label: 'Monthly Savings', val: latest.monthly_savings, prefix: '₹' },
              { label: 'Total Debt', val: latest.total_debt, prefix: '₹' },
              { label: 'Monthly EMI', val: latest.monthly_emi, prefix: '₹' },
              { label: 'Emergency Fund', val: latest.emergency_fund, prefix: '₹' },
            ].map(({ label, val, prefix }) => (
              <div className="snapshot-item" key={label}>
                <div className="snapshot-label">{label}</div>
                <div className="snapshot-val">{prefix}{parseFloat(val || 0).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>

          {/* AI Features Section */}
          <div className="ai-section fadeUp fadeUp-5">
            <AIExplanation assessment={latest} />
          </div>

          {/* AI Chat Section */}
          <div className="chat-section fadeUp fadeUp-6">
            <h2>Get Your Questions Answered</h2>
            <AIChat />
          </div>
        </>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
