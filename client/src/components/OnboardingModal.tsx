import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trash2, RefreshCw, ShoppingCart, ArrowRight, Check } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { user, setShowTutorial } = useGame();
  const [step, setStep] = useState(0);

  const steps = [
    {
      stepNum: '1️⃣',
      icon: <Trash2 className="w-10 h-10 text-emerald-400" />,
      title: 'Collect Waste',
      desc: 'Gather Organic, Plastic, Paper, Metal, E-waste and Construction materials from Houses, Offices, Parks, and Factories around your town.'
    },
    {
      stepNum: '2️⃣',
      icon: <RefreshCw className="w-10 h-10 text-amber-400 animate-spin-slow" />,
      title: 'Sort & Recycle',
      desc: 'Play the sorting mini-game to gain bonus XP & Green Score! Send sorted waste to specialized processing plants to create Biogas, Plastic Granules, Cardboard, and Metal Ingots.'
    },
    {
      stepNum: '3️⃣',
      icon: <ShoppingCart className="w-10 h-10 text-gold-400" />,
      title: 'Sell & Upgrade',
      desc: 'Sell finished eco-products in the market for cash! Upgrade your trucks, sorters, and solar power to transform your Village into a thriving Green City!'
    }
  ];

  const handleFinish = () => {
    localStorage.setItem('w2w_seen_tutorial', 'true');
    setShowTutorial(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl relative text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-eco-400 mb-2">
          First-Time Manager Onboarding
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          WELCOME, {user?.name?.toUpperCase() || 'MANAGER'}! 👋
        </h2>
        <p className="text-slate-300 text-sm mb-6">
          You are now the manager of a small waste-management business. Turn garbage into gold!
        </p>

        {/* Card slider */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center min-h-[220px]">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 shadow-inner">
            {steps[step].icon}
          </div>
          <div className="text-xs font-extrabold text-eco-400 tracking-wider mb-1">
            STEP {step + 1} OF 3 {steps[step].stepNum}
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">{steps[step].title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm">{steps[step].desc}</p>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`h-2.5 rounded-full transition-all ${
                step === idx ? 'w-8 bg-eco-500' : 'w-2.5 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleFinish}
            className="text-xs text-slate-400 hover:text-slate-200 font-semibold px-3 py-2"
          >
            Skip Tutorial
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="py-3 px-6 rounded-full font-bold text-sm bg-eco-500 hover:bg-eco-400 text-slate-950 shadow-lg shadow-eco-500/25 flex items-center gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="py-3 px-6 rounded-full font-bold text-sm bg-gradient-to-r from-eco-500 to-emerald-400 hover:from-eco-400 hover:to-emerald-300 text-slate-950 shadow-lg shadow-eco-500/30 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>START YOUR CITY</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
