import React, { useState } from 'react';
import { User as UserIcon, Mail, ShieldAlert, LogOut, RotateCcw, Award, Leaf, Coins, Trash2, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { gameState, setActiveTab, resetGame } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!gameState) return null;

  const unlockedCount = gameState.achievements.filter((a) => a.unlocked).length;

  const handleConfirmReset = async () => {
    await resetGame();
    setShowResetConfirm(false);
    setActiveTab('home');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-4xl mx-auto">
      {/* Profile Overview Card */}
      <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8" glow="eco">
        <img
          src={
            user?.picture ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80'
          }
          alt={user?.name || 'Player'}
          className="w-24 h-24 rounded-3xl object-cover border-4 border-eco-500/40 shadow-2xl shrink-0"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-2xl font-black text-white">{user?.name || 'Eco Manager'}</h2>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-eco-500/20 text-eco-300 border border-eco-500/40 inline-block mx-auto sm:mx-0">
              {gameState.levelTitle} (Level {gameState.level})
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-300">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{user?.email || 'manager@wastetowealth.eco'}</span>
            {user?.isDemo && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo Account
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 pt-1">
            Registered: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Simulation'}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-3 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab('settings')}
              icon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              icon={<LogOut className="w-4 h-4 text-rose-400" />}
            >
              Logout
            </Button>
          </div>
        </div>
      </Card>

      {/* Lifetime Career Stats Grid */}
      <div>
        <h3 className="text-base font-black text-white mb-3">Lifetime Manager Career Records</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <Coins className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
            <span className="text-[11px] text-slate-400 font-bold uppercase">Total Profit</span>
            <div className="text-lg font-black text-amber-300 font-mono mt-0.5">
              ₹{gameState.stats.totalProfit.toLocaleString()}
            </div>
          </Card>

          <Card className="text-center p-4">
            <Trash2 className="w-6 h-6 text-teal-400 mx-auto mb-1.5" />
            <span className="text-[11px] text-slate-400 font-bold uppercase">Waste Recycled</span>
            <div className="text-lg font-black text-teal-300 font-mono mt-0.5">
              {gameState.stats.totalWasteRecycled.toLocaleString()} kg
            </div>
          </Card>

          <Card className="text-center p-4">
            <Leaf className="w-6 h-6 text-eco-400 mx-auto mb-1.5" />
            <span className="text-[11px] text-slate-400 font-bold uppercase">Green Score</span>
            <div className="text-lg font-black text-eco-300 font-mono mt-0.5">
              {gameState.greenScore} / 100
            </div>
          </Card>

          <Card className="text-center p-4">
            <Award className="w-6 h-6 text-purple-400 mx-auto mb-1.5" />
            <span className="text-[11px] text-slate-400 font-bold uppercase">Achievements</span>
            <div className="text-lg font-black text-purple-300 font-mono mt-0.5">
              {unlockedCount} / {gameState.achievements.length}
            </div>
          </Card>
        </div>
      </div>

      {/* Danger Zone: Reset Game */}
      <Card className="border-rose-500/40 bg-rose-950/20 p-6 space-y-4">
        <div className="flex items-center gap-3 text-rose-400">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-black text-base text-rose-300">Danger Zone: Reset Simulation</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Permanently wipe all city progress, upgrades, unlocked tiers, inventory, and start fresh from Village Level 1.
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="md"
          onClick={() => setShowResetConfirm(true)}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          RESET ALL GAME PROGRESS
        </Button>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Confirm Game Reset"
        icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
      >
        <div className="space-y-4 text-center">
          <div className="text-4xl">⚠️</div>
          <h4 className="text-lg font-black text-white">Are you absolutely sure?</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            All your collected wealth (₹{gameState.money.toLocaleString()}), city upgrades, completed missions, and Green Score will be deleted. This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" size="md" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleConfirmReset}>
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
