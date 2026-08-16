import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, RefreshCw } from 'lucide-react';
import { LeaderboardEntry } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { SAMPLE_LEADERBOARD } from '../../services/gameStateEngine';

export const LeaderboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { gameState } = useGame();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        if (data.leaderboard && data.leaderboard.length > 0) {
          setEntries(data.leaderboard);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Local leaderboard calculation
    const all = [...SAMPLE_LEADERBOARD];
    if (gameState && user) {
      const userEntry: LeaderboardEntry = {
        userId: user.id,
        name: `${user.name} (You)`,
        picture: user.picture,
        greenScore: gameState.greenScore,
        totalWasteRecycled: gameState.stats.totalWasteRecycled,
        levelTitle: gameState.levelTitle,
        level: gameState.level,
        totalProfit: gameState.stats.totalProfit,
      };
      all.push(userEntry);
    }
    all.sort((a, b) => b.greenScore - a.greenScore || b.totalWasteRecycled - a.totalWasteRecycled);
    setEntries(all);
    setIsLoading(false);
  }, [gameState, user]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="text-2xl">🥇</span>;
    if (index === 1) return <span className="text-2xl">🥈</span>;
    if (index === 2) return <span className="text-2xl">🥉</span>;
    return <span className="font-mono font-black text-slate-400 text-sm">#{index + 1}</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-2xl font-black text-white">Global Sustainability Rankings</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Top circular economy managers ranked by Green Score, recycled throughput, and city evolution.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchLeaderboard}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Rankings
        </Button>
      </div>

      {/* Leaderboard Table Card */}
      <Card className="overflow-x-auto p-0 rounded-3xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-black uppercase text-slate-400">
              <th className="py-4 px-4 text-center">Rank</th>
              <th className="py-4 px-4">Manager / City</th>
              <th className="py-4 px-4 text-center">Green Score</th>
              <th className="py-4 px-4 text-right">Recycled (kg)</th>
              <th className="py-4 px-4 text-right">City Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {entries.map((entry, idx) => {
              const isCurrentUser = user && entry.userId === user.id;

              return (
                <tr
                  key={entry.userId || idx}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-eco-950/40 font-bold border-l-4 border-eco-400'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3.5 px-4 text-center w-16">{getRankBadge(idx)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          entry.picture ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'
                        }
                        alt={entry.name}
                        className="w-9 h-9 rounded-2xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-black text-white flex items-center gap-1.5">
                          <span>{entry.name}</span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-eco-500/20 text-eco-300 border border-eco-500/40">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Profit: ₹{entry.totalProfit?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-eco-500/15 border border-eco-500/30 text-eco-300 font-black font-mono">
                      <Leaf className="w-3.5 h-3.5 text-eco-400" />
                      {entry.greenScore} / 100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                    {entry.totalWasteRecycled?.toLocaleString()} kg
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-300">
                    {entry.levelTitle}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
