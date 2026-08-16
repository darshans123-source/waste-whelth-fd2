import React from 'react';
import { useGame } from '../context/GameContext';
import { Leaf, ShieldCheck, Zap, RefreshCw, AlertTriangle } from 'lucide-react';

export const GreenScoreGauge: React.FC = () => {
  const { greenScore, totalWasteRecycled, upgrades } = useGame();

  // SVG Circular Gauge parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (greenScore / 100) * circumference;

  let ecoTier = { title: '🍂 Eco Beginner', color: 'text-amber-400', desc: 'Start collecting and sorting waste to clean up your town.' };
  if (greenScore >= 81) {
    ecoTier = { title: '🌍 Green Champion', color: 'text-eco-400', desc: 'Outstanding environmental stewardship! Your city is a beacon of circular living.' };
  } else if (greenScore >= 61) {
    ecoTier = { title: '🌿 Sustainable Urbanist', color: 'text-emerald-400', desc: 'High recycling output and clean renewable solar infrastructure.' };
  } else if (greenScore >= 31) {
    ecoTier = { title: '🌱 Recycling Enthusiast', color: 'text-teal-400', desc: 'Steady waste diversion from landfills. Keep expanding!' };
  }

  const tips = [
    { title: 'Sort Waste Accurately', impact: '+10 XP & Green Boost', icon: RefreshCw, type: 'positive' },
    { title: 'Install Solar Power Grid', impact: '+35 Green Score', icon: Zap, type: 'positive' },
    { title: 'Recycle Raw Waste', impact: '+0.1 Score / kg', icon: Leaf, type: 'positive' },
    { title: 'Wrong Bin Sorting', impact: '-0.5 Score / error', icon: AlertTriangle, type: 'negative' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Gauge Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        {/* SVG Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="14"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="url(#greenGradient)"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <Leaf className="w-6 h-6 text-eco-400 mb-1" />
            <span className="text-4xl font-extrabold text-white tracking-tight">{greenScore}</span>
            <span className="text-xs font-bold text-slate-400">OUT OF 100</span>
          </div>
        </div>

        {/* Tier Details */}
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="text-xs font-extrabold text-eco-400 uppercase tracking-widest">
            Environmental Impact Rating
          </div>
          <h2 className={`text-3xl font-extrabold ${ecoTier.color}`}>{ecoTier.title}</h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md">{ecoTier.desc}</p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
            <span className="bg-slate-900/90 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 border border-slate-800">
              Total Recycled: {totalWasteRecycled} kg
            </span>
            <span className="bg-slate-900/90 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 border border-slate-800">
              Solar Tech: Level {upgrades.solar}
            </span>
          </div>
        </div>
      </div>

      {/* Score Impact Drivers */}
      <div>
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Score Drivers & Impact Factors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tips.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass-card p-4 rounded-2xl border border-slate-800 flex items-start gap-3"
              >
                <div className={`p-2.5 rounded-xl ${item.type === 'positive' ? 'bg-eco-500/20 text-eco-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{item.title}</h4>
                  <span className={`text-[11px] font-extrabold ${item.type === 'positive' ? 'text-eco-400' : 'text-rose-400'}`}>
                    {item.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
