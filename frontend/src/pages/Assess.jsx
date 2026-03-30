import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AssessResult from '../components/AssessResult';
import './Assess.css';

const STEPS = [
  { id: 'income', title: 'Income & Stability', icon: '💰' },
  { id: 'expenses', title: 'Expenses & Savings', icon: '💳' },
  { id: 'debt', title: 'Debt & EMIs', icon: '🏦' },
  { id: 'safety', title: 'Safety Net', icon: '🛡️' },
];

const defaultForm = {
  monthly_income: '',
  income_type: 'salaried',
  income_stability: 'stable',
  dependents: '0',
  monthly_expenses: '',
  monthly_savings: '',
  investment_monthly: '',
  total_debt: '',
  monthly_emi: '',
  emergency_fund: '',
  has_health_insurance: false,
  has_life_insurance: false,
};

export default function Assess() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleNext = () => {
    setError('');
    if (step === 0 && !form.monthly_income) return setError('Please enter your monthly income');
    if (step === 1 && !form.monthly_expenses) return setError('Please enter your monthly expenses');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach(k => {
        if (typeof payload[k] === 'string' && payload[k] !== '' && !isNaN(payload[k])) {
          payload[k] = parseFloat(payload[k]);
        }
      });
      payload.dependents = parseInt(form.dependents) || 0;
      const { data } = await api.post('/risk/assess', payload);
      setResult(data.assessment);
    } catch (err) {
      setError(err.response?.data?.message || 'Assessment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <AssessResult result={result} onNew={() => { setResult(null); setStep(0); setForm(defaultForm); }} onDashboard={() => navigate('/dashboard')} />;
  }

  return (
    <div className="assess-page">
      <div className="assess-header">
        <h1>New Risk Assessment</h1>
        <p className="assess-sub">Fill in your financial details to get a personalized risk profile</p>
      </div>

      {/* Progress */}
      <div className="steps-bar">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="step-circle">{i < step ? '✓' : i + 1}</div>
            <div className="step-label">{s.title}</div>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="assess-card">
        <div className="assess-card-header">
          <span className="step-icon">{STEPS[step].icon}</span>
          <div>
            <div className="step-num">Step {step + 1} of {STEPS.length}</div>
            <div className="step-title">{STEPS[step].title}</div>
          </div>
        </div>

        {error && <div className="assess-error">{error}</div>}

        {/* Step 0: Income */}
        {step === 0 && (
          <div className="form-grid">
            <div className="form-field full">
              <label>Monthly Income (₹) <span className="req">*</span></label>
              <input type="number" placeholder="e.g. 75000" value={form.monthly_income} onChange={e => set('monthly_income', e.target.value)} min="0" />
              <span className="field-hint">Your total monthly take-home pay</span>
            </div>
            <div className="form-field">
              <label>Income Type</label>
              <select value={form.income_type} onChange={e => set('income_type', e.target.value)}>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-Employed</option>
                <option value="business">Business Owner</option>
                <option value="freelance">Freelancer</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div className="form-field">
              <label>Income Stability</label>
              <select value={form.income_stability} onChange={e => set('income_stability', e.target.value)}>
                <option value="very_stable">Very Stable</option>
                <option value="stable">Stable</option>
                <option value="moderate">Moderate</option>
                <option value="unstable">Unstable</option>
                <option value="very_unstable">Very Unstable</option>
              </select>
            </div>
            <div className="form-field">
              <label>Number of Dependents</label>
              <input type="number" placeholder="0" value={form.dependents} onChange={e => set('dependents', e.target.value)} min="0" max="20" />
              <span className="field-hint">People financially dependent on you</span>
            </div>
          </div>
        )}

        {/* Step 1: Expenses */}
        {step === 1 && (
          <div className="form-grid">
            <div className="form-field full">
              <label>Monthly Expenses (₹) <span className="req">*</span></label>
              <input type="number" placeholder="e.g. 45000" value={form.monthly_expenses} onChange={e => set('monthly_expenses', e.target.value)} min="0" />
              <span className="field-hint">Total monthly spending (rent, food, utilities, etc.)</span>
            </div>
            <div className="form-field">
              <label>Monthly Savings (₹)</label>
              <input type="number" placeholder="e.g. 10000" value={form.monthly_savings} onChange={e => set('monthly_savings', e.target.value)} min="0" />
              <span className="field-hint">Amount saved each month</span>
            </div>
            <div className="form-field">
              <label>Monthly Investments (₹)</label>
              <input type="number" placeholder="e.g. 5000" value={form.investment_monthly} onChange={e => set('investment_monthly', e.target.value)} min="0" />
              <span className="field-hint">SIPs, stocks, mutual funds, etc.</span>
            </div>
          </div>
        )}

        {/* Step 2: Debt */}
        {step === 2 && (
          <div className="form-grid">
            <div className="form-field full">
              <label>Total Outstanding Debt (₹)</label>
              <input type="number" placeholder="e.g. 500000" value={form.total_debt} onChange={e => set('total_debt', e.target.value)} min="0" />
              <span className="field-hint">Sum of all loans, credit cards, etc.</span>
            </div>
            <div className="form-field full">
              <label>Total Monthly EMI (₹)</label>
              <input type="number" placeholder="e.g. 15000" value={form.monthly_emi} onChange={e => set('monthly_emi', e.target.value)} min="0" />
              <span className="field-hint">Combined monthly loan repayments</span>
            </div>
          </div>
        )}

        {/* Step 3: Safety Net */}
        {step === 3 && (
          <div className="form-grid">
            <div className="form-field full">
              <label>Emergency Fund (₹)</label>
              <input type="number" placeholder="e.g. 150000" value={form.emergency_fund} onChange={e => set('emergency_fund', e.target.value)} min="0" />
              <span className="field-hint">Liquid savings set aside for emergencies</span>
            </div>
            <div className="form-field full">
              <label>Insurance Coverage</label>
              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input type="checkbox" checked={form.has_health_insurance} onChange={e => set('has_health_insurance', e.target.checked)} />
                  <span className="checkmark" />
                  <span>I have health / medical insurance</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" checked={form.has_life_insurance} onChange={e => set('has_life_insurance', e.target.checked)} />
                  <span className="checkmark" />
                  <span>I have life / term insurance</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="assess-nav">
          {step > 0 && (
            <button className="nav-back" onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button className="nav-next" onClick={handleNext}>
              Continue →
            </button>
          ) : (
            <button className="nav-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className="spinner-sm" /> Analyzing…</> : '🔍 Analyze My Risk'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
