import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Moon, Bell, LogOut, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const SettingsScreen: React.FC = () => {
  const { soundEnabled, musicEnabled, toggleSound, toggleMusic } = useSound();
  const { logout } = useAuth();
  const { resetGame, setActiveTab, showToast } = useGame();

  const [notifications, setNotifications] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = async () => {
    await resetGame();
    setShowResetConfirm(false);
    setActiveTab('home');
  };

  const handleToggleNotifications = () => {
    setNotifications((prev) => !prev);
    showToast('Preferences Updated', `Notifications ${!notifications ? 'Enabled' : 'Muted'}`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-2xl font-black text-white">Audio & Game Settings</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Configure sound synthesizers, ambient soundtrack, alerts, and account preferences.
          </p>
        </div>
      </div>

      {/* Audio Preferences */}
      <Card className="space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <span>🔊</span> Audio System (Web Audio API Synthesizer)
        </h3>

        <div className="divide-y divide-slate-800 text-xs">
          {/* Sound FX */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${soundEnabled ? 'bg-eco-500/20 text-eco-400 border-eco-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-white text-sm">Sound Effects (SFX)</div>
                <div className="text-slate-400 text-[11px]">Clicking, coins, sorting chimes, truck engine, level fanfare</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${soundEnabled ? 'bg-eco-500 justify-end' : 'bg-slate-700 justify-start'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Ambient Music */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${musicEnabled ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Ambient Background Synth</div>
                <div className="text-slate-400 text-[11px]">Dynamic generative relaxing synth chords</div>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${musicEnabled ? 'bg-purple-500 justify-end' : 'bg-slate-700 justify-start'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>
      </Card>

      {/* Interface & Notifications */}
      <Card className="space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <span>🔔</span> Notifications & Theme
        </h3>

        <div className="divide-y divide-slate-800 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">In-Game Toasts & Event Alerts</div>
                <div className="text-slate-400 text-[11px]">Real-time popups for completed missions & random events</div>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${notifications ? 'bg-eco-500 justify-end' : 'bg-slate-700 justify-start'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-sky-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Dark Eco Theme</div>
                <div className="text-slate-400 text-[11px]">Optimized for low-light casual gaming</div>
              </div>
            </div>
            <span className="text-xs font-bold text-eco-400 px-2.5 py-1 rounded-full bg-eco-500/20">
              Active
            </span>
          </div>
        </div>
      </Card>

      {/* Account & Data */}
      <Card className="space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <span>👤</span> Session Management
        </h3>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">Sign out of this game session safely</div>
          <Button variant="outline" size="sm" onClick={logout} icon={<LogOut className="w-4 h-4 text-rose-400" />}>
            Logout Account
          </Button>
        </div>
      </Card>

      {/* Danger Zone: Reset Simulation */}
      <Card className="border-rose-500/40 bg-rose-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-300 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Reset City Game Data</span>
          </div>

          <Button variant="danger" size="sm" onClick={() => setShowResetConfirm(true)} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Progress
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Confirm Reset"
        icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
      >
        <div className="space-y-4 text-center">
          <div className="text-4xl">⚠️</div>
          <h4 className="text-lg font-black text-white">Are you sure? All game progress will be deleted.</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your city will return to a starting Village with ₹5,000 baseline capital.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" size="md" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleConfirmReset}>
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
