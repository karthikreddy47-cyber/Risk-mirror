import { useEffect, useState } from 'react';
import './RatioBar.css';

export default function RatioBar({ label, value, good, warn, unit, inverse, desc }) {
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnim(Math.min(value, 100)), 200);
    return () => clearTimeout(t);
  }, [value]);

  // Determine status: for inverse (lower=better), for normal (higher=better)
  let status = 'good';
  if (inverse) {
    if (value > warn) status = 'bad';
    else if (value > good) status = 'warn';
  } else {
    if (value < warn) status = 'bad';
    else if (value < good) status = 'warn';
  }

  const colors = { good: 'var(--green)', warn: 'var(--amber)', bad: 'var(--accent)' };
  const bgs = { good: 'var(--green-light)', warn: 'var(--amber-light)', bad: 'var(--accent-light)' };
  const labels = { good: 'Healthy', warn: 'Caution', bad: 'Risk' };

  const pct = Math.min((value / (inverse ? Math.max(warn * 2, value + 5) : Math.max(good * 1.5, value + 5))) * 100, 100);

  return (
    <div className="ratio-bar-card">
      <div className="rb-top">
        <span className="rb-label">{label}</span>
        <span className="rb-badge" style={{ background: bgs[status], color: colors[status] }}>{labels[status]}</span>
      </div>
      <div className="rb-value">{parseFloat(value || 0).toFixed(1)}{unit}</div>
      <div className="rb-track">
        <div
          className="rb-fill"
          style={{
            width: `${anim <= 0 ? 0 : pct}%`,
            background: colors[status],
            transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      <div className="rb-desc">{desc}</div>
    </div>
  );
}
