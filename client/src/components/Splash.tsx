import React, { useEffect, useState } from 'react';
import { RefreshCw, Leaf, Sparkles } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white overflow-hidden select-none">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-eco-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col items-center text-center px-4 max-w-md w-full">
        {/* Animated Rotating Recycling Symbol */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-slate-800/80 border-2 border-eco-500/40 flex items-center justify-center shadow-2xl shadow-eco-500/20 backdrop-blur-md">
            <RefreshCw className="w-16 h-16 text-eco-400 animate-spin-slow" />
          </div>
          <div className="absolute -top-2 -right-2 p-2 bg-eco-500 text-slate-950 rounded-full shadow-lg animate-bounce-subtle">
            <Leaf className="w-5 h-5 fill-current" />
          </div>
          <div className="absolute -bottom-1 -left-2 p-1.5 bg-amber-400 text-slate-950 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold tracking-widest text-eco-400 uppercase">
            <span>♻️</span>
            <span>WASTE</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            TO <span className="eco-gradient-text">WEALTH</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-slate-300 font-medium text-base mb-8 italic">
          "Turn Waste Into Wealth. Build a Greener Future."
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-800/80 rounded-full h-3 p-0.5 border border-slate-700/60 shadow-inner mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-eco-500 to-emerald-400 h-full rounded-full transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <Leaf className="w-3.5 h-3.5 text-eco-400" />
          <span>Powered by Circular Economy</span>
        </div>
      </div>
    </div>
  );
};
