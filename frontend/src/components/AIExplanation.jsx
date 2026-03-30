import { useState } from 'react';
import api from '../utils/api';
import './AIExplanation.css';

export default function AIExplanation({ assessment }) {
  const [explanation, setExplanation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/analyze');
      if (data.success) {
        setExplanation(data.analysis.explanation);
        setRecommendations(data.analysis.recommendations);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate AI analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-explanation-section">
      <div className="ai-header">
        <h2>🤖 AI Analysis</h2>
        <button className="ai-btn-analyze" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Get AI Insights'}
        </button>
      </div>

      {error && <div className="ai-error-msg">{error}</div>}

      {explanation && (
        <>
          {/* Explanation Card */}
          <div className="ai-card explanation-card fadeIn">
            <div className="card-icon">💡</div>
            <div className="card-content">
              <h3>Why Your Risk Score Matters</h3>
              <p className="ai-explanation-text">{explanation}</p>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="ai-recommendations fadeIn">
              <h3>📈 Personalized Recommendations</h3>
              <div className="rec-grid">
                {recommendations.map((rec, index) => (
                  <div key={index} className="rec-card">
                    <div className="rec-number">{index + 1}</div>
                    <div className="rec-content">
                      <p>{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!explanation && !loading && (
        <div className="ai-empty-state">
          <div className="empty-icon">🔮</div>
          <p>Click "Get AI Insights" to unlock personalized financial guidance powered by AI</p>
        </div>
      )}
    </div>
  );
}
