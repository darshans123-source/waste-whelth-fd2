import React from 'react';
import { Target, CheckCircle2, Gift, Sparkles, Coins, Leaf } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

export const MissionsScreen: React.FC = () => {
  const { gameState, claimMission } = useGame();

  if (!gameState) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h2 className="text-2xl font-black text-white">Daily Circular Missions</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Complete daily operational milestones to earn bonus revenue, XP, and Green Score bonuses.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-eco-500/15 border border-eco-500/30 text-eco-300 text-xs font-bold">
          {gameState.missions.filter((m) => m.completed && !m.claimed).length} Rewards Ready to Claim!
        </div>
      </div>

      {/* Missions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gameState.missions.map((mission) => {
          const isCompleted = mission.completed;
          const isClaimed = mission.claimed;

          return (
            <Card
              key={mission.id}
              className={`flex flex-col justify-between space-y-4 ${
                isCompleted && !isClaimed ? 'border-amber-500/50 gold-glow' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-eco-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-white">{mission.title}</h3>
                      <p className="text-xs text-slate-300 leading-tight">{mission.description}</p>
                    </div>
                  </div>
                  {isClaimed && (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-slate-800 text-slate-400 border border-slate-700">
                      ✓ CLAIMED
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="py-2">
                  <ProgressBar
                    value={mission.currentValue}
                    max={mission.targetValue}
                    label={`Progress: ${mission.currentValue} / ${mission.targetValue}`}
                    color={isCompleted ? 'gold' : 'eco'}
                  />
                </div>

                {/* Rewards Breakdown */}
                <div className="flex items-center gap-3 pt-2 text-xs font-bold">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Coins className="w-3.5 h-3.5" /> +₹{mission.rewardMoney}
                  </span>
                  <span className="flex items-center gap-1 text-sky-300">
                    <Sparkles className="w-3.5 h-3.5" /> +{mission.rewardXP} XP
                  </span>
                  <span className="flex items-center gap-1 text-eco-400">
                    <Leaf className="w-3.5 h-3.5" /> +{mission.rewardGreenScore} Score
                  </span>
                </div>
              </div>

              <div>
                {isCompleted && !isClaimed ? (
                  <Button
                    variant="gold"
                    size="md"
                    className="w-full"
                    onClick={() => claimMission(mission.id)}
                    icon={<Gift className="w-4 h-4 text-slate-950" />}
                  >
                    CLAIM REWARD
                  </Button>
                ) : isClaimed ? (
                  <div className="py-2.5 text-center text-xs font-bold text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700">
                    Completed for Today
                  </div>
                ) : (
                  <div className="py-2.5 text-center text-xs font-bold text-slate-400 bg-slate-800/60 rounded-2xl border border-slate-700">
                    In Progress ({mission.currentValue} / {mission.targetValue})
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
