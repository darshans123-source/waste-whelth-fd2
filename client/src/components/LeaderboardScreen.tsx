import React, { useEffect, useState } from 'react';
import { formatWeight } from '../utils/formatters';
import { Trophy, Medal, Award, UserCheck } from 'lucide-react';

interface LeaderboardItem {
  id: string;
  name: string;
  picture: string;
  greenScore: number;
  totalWasteRecycled: number;
  cityLevel: number;
  rank: number;
}

export const LeaderboardScreen: React.FC = () => {
  const [players, setPlayers] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setPlayers(data.leaderboard || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Global Circular Rankings</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Green Leaderboard</h2>
          <p className="text-slate-300 text-sm">
            Top environmental managers creating a sustainable zero-waste world.
          </p>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-semibold">Loading Leaderboard...</div>
        ) : (
          players.map((p) => {
            const isTop3 = p.rank <= 3;
            const rankIcon = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`;

            return (
              <div
                key={p.id}
                className={`glass-card p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  p.rank === 1
                    ? 'border-amber-500/60 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 ${
                    p.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {rankIcon}
                  </div>

                  <img
                    src={p.picture}
                    alt={p.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-eco-400 shrink-0"
                  />

                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white text-base truncate">{p.name}</h3>
                    <div className="text-xs text-slate-400 font-semibold">
                      City Level {p.cityLevel}
                    </div>
                  </div>
                </div>

                {/* Score Stats */}
                <div className="flex items-center gap-4 sm:gap-6 text-right shrink-0">
                  <div>
                    <div className="text-xs text-slate-400 font-bold">Waste Recycled</div>
                    <div className="text-sm font-extrabold text-slate-200">{formatWeight(p.totalWasteRecycled)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">Green Score</div>
                    <div className="text-base font-extrabold text-eco-400">🌱 {p.greenScore}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
