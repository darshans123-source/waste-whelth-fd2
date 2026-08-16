import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: 'eco' | 'gold' | 'sky' | 'purple';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  color = 'eco',
  showPercentage = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)));

  const gradientMap = {
    eco: 'from-eco-500 to-emerald-400',
    gold: 'from-gold-500 to-amber-400',
    sky: 'from-sky-500 to-cyan-400',
    purple: 'from-purple-500 to-indigo-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono text-slate-200">{percentage}%</span>}
        </div>
      )}
      <div className="h-3.5 w-full bg-slate-800/80 rounded-full p-0.5 border border-slate-700/60 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientMap[color]} transition-all duration-500 shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
