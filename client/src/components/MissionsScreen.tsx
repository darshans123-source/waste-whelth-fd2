import React from 'react';
import { useGame } from '../context/GameContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Target, CheckCircle2, Gift, Sparkles } from 'lucide-react';

export const MissionsScreen: React.FC = () => {
  const { missions, claimMissionReward } = useGame();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>Daily Operations</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Daily Recycling Quests</h2>
          <p className="text-slate-300 text-sm">
            Complete daily objectives to earn bonus money, XP, and Green Score boosts.
          </p>
        </div>
      </div>

      {/* Quest Cards */}
      <div className="space-y-3">
        {missions.map((m) => {
          const progressPercent = Math.min(100, Math.round((m.current / m.target) * 100));

          return (
            <div
              key={m.id}
              className={`glass-card p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-md ${
                m.claimed
                  ? 'border-slate-800 bg-slate-950/40 opacity-70'
                  : m.completed
                  ? 'border-eco-500/60 bg-eco-950/20'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  {m.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-eco-400 flex-shrink-0" />
                  ) : (
                    <Target className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  )}
                  <h3 className="font-bold text-white text-base">{m.title}</h3>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Progress</span>
                    <span>{formatNumber(m.current)} / {formatNumber(m.target)} ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-eco-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Rewards preview */}
                <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-300 pt-1">
                  <span className="text-amber-300">+{formatCurrency(m.rewardMoney)}</span>
                  <span>•</span>
                  <span className="text-purple-300">+{m.rewardXP} XP</span>
                  <span>•</span>
                  <span className="text-eco-400">+{m.rewardGreen} Green Score</span>
                </div>
              </div>

              {/* Reward Claim Button */}
              <div className="flex-shrink-0">
                {m.claimed ? (
                  <span className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-800 text-slate-500 border border-slate-700">
                    ✓ REWARD CLAIMED
                  </span>
                ) : m.completed ? (
                  <button
                    onClick={() => claimMissionReward(m.id)}
                    className="py-2.5 px-6 rounded-xl font-extrabold text-xs bg-gradient-to-r from-eco-500 to-emerald-400 hover:from-eco-400 hover:to-emerald-300 text-slate-950 shadow-lg shadow-eco-500/25 flex items-center gap-1.5 animate-pulse"
                  >
                    <Gift className="w-4 h-4 fill-current" />
                    <span>CLAIM REWARD</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-400">
                    IN PROGRESS
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
