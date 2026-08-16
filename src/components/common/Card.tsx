import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: 'eco' | 'gold' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glow = 'none',
  onClick,
}) => {
  let glowClass = '';
  if (glow === 'eco') glowClass = 'eco-glow';
  if (glow === 'gold') glowClass = 'gold-glow';

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-3xl p-5 md:p-6 text-slate-100 ${
        hoverEffect ? 'glass-card-hover cursor-pointer' : ''
      } ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
};
