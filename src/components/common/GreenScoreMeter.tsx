import React from 'react';

interface GreenScoreMeterProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const GreenScoreMeter: React.FC<GreenScoreMeterProps> = ({
  score,
  size = 110,
  strokeWidth = 10,
  showLabel = true,
}) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = '#22c55e'; // Green
  let statusText = 'Eco Pioneer';
  if (normalizedScore < 30) {
    colorClass = '#f97316'; // Orange
    statusText = 'Needs Action';
  } else if (normalizedScore < 70) {
    colorClass = '#eab308'; // Yellow
    statusText = 'Developing';
  } else if (normalizedScore >= 90) {
    colorClass = '#10b981'; // Emerald
    statusText = 'Zero Waste City';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${colorClass}66)`,
            }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black tracking-tight text-white">{normalizedScore}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
        </div>
      </div>
      {showLabel && (
        <div className="mt-2 text-center">
          <span
            className="text-xs font-extrabold px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${colorClass}22`,
              color: colorClass,
              border: `1px solid ${colorClass}44`,
            }}
          >
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};
