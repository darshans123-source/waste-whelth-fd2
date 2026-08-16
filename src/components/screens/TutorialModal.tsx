import React from 'react';
import { Sparkles, Trash2, Boxes, Factory } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { completeTutorial } = useGame();

  if (!isOpen) return null;

  const handleStart = () => {
    completeTutorial();
    onClose();
  };

  const steps = [
    {
      num: '1️⃣',
      title: 'Collect Waste',
      desc: 'Gather plastic, organic, paper, and e-waste from houses, schools, offices, and construction sites.',
      icon: Trash2,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      num: '2️⃣',
      title: 'Sort in Mini-Game',
      desc: 'Sort waste into the correct colored bins to boost your Green Score and earn bonus XP.',
      icon: Boxes,
      color: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    },
    {
      num: '3️⃣',
      title: 'Recycle & Sell',
      desc: 'Process raw waste into valuable products like Biogas, Cardboard, & Metal Ingots to earn ₹ money and upgrade your city!',
      icon: Factory,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fade-in">
      <div className="max-w-xl w-full glass-panel border border-eco-500/40 rounded-3xl p-6 md:p-8 shadow-2xl eco-glow text-center text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-eco-500 to-emerald-400 p-0.5 mx-auto mb-4 shadow-lg shadow-eco-500/30 flex items-center justify-center text-2xl">
          🌱
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-white mb-1">
          WELCOME, {user?.name?.toUpperCase() || 'MANAGER'}! 👋
        </h3>
        <p className="text-sm text-eco-300 font-medium mb-6">
          You are now the manager of a circular-economy waste-management enterprise.
        </p>

        {/* 3 Tutorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8 text-left">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black">{step.num}</span>
                    <div className={`p-2 rounded-xl border ${step.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-300 leading-snug">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <Button
          variant="gold"
          size="lg"
          className="w-full py-4 text-base tracking-wider"
          onClick={handleStart}
          icon={<Sparkles className="w-5 h-5 text-slate-950" />}
        >
          START YOUR CITY
        </Button>
      </div>
    </div>
  );
};
