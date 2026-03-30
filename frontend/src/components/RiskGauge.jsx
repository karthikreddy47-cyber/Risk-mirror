import { useEffect, useState } from 'react';
import './RiskGauge.css';

export default function RiskGauge({ score, category }) {
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const r = 80;
  const cx = 110;
  const cy = 110;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.75; // 270deg arc
  const dashOffset = arc - (arc * animScore) / 100;

  const color = category === 'Low Risk' ? '#2a7a4b'
    : category === 'Moderate Risk' ? '#c27a1a'
    : '#c8412a';

  // Needle angle: -135deg (0%) to +135deg (100%)
  const needleAngle = -135 + (animScore / 100) * 270;

  return (
    <div className="gauge-wrap">
      <svg width="220" height="160" viewBox="0 0 220 160">
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#f0ede7"
          strokeWidth="14"
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform="rotate(135, 110, 110)"
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(135, 110, 110)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', stroke: color }}
        />
        {/* Needle */}
        <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`} style={{ transition: 'transform 1.2s cubic-bezier(0.4,0,0.2,1)' }}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 16} stroke="#0f0f11" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="5" fill="#0f0f11" />
        </g>
        {/* Score text */}
        <text x={cx} y={cy + 32} textAnchor="middle" fontFamily="'DM Serif Display', serif" fontSize="38" fill="#0f0f11">
          {Math.round(animScore)}
        </text>
        <text x={cx} y={cy + 50} textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="12" fill="rgba(15,15,17,0.5)" letterSpacing="1">
          / 100
        </text>
        {/* Range labels */}
        <text x="22" y="148" fontFamily="'DM Sans', sans-serif" fontSize="11" fill="rgba(15,15,17,0.4)">High</text>
        <text x="176" y="148" fontFamily="'DM Sans', sans-serif" fontSize="11" fill="rgba(15,15,17,0.4)">Low</text>
      </svg>
    </div>
  );
}
