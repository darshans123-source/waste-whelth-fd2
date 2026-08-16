import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-eco-950 p-6 select-none overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-eco-500/15 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full animate-fade-in">
        {/* Animated Rotating Recycling Symbol */}
        <div className="relative mb-6">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-teal-400 p-1 shadow-2xl shadow-eco-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/80 rounded-[22px] flex items-center justify-center backdrop-blur-sm">
              <span className="text-5xl md:text-6xl animate-spin-slow origin-center select-none">
                ♻️
              </span>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 p-2 bg-amber-400 text-slate-950 rounded-2xl shadow-lg animate-bounce-subtle">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-white mb-2 leading-none">
          WASTE <span className="text-eco-400">TO</span> WEALTH
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-base text-slate-300 font-semibold mb-8 max-w-xs">
          Turn Waste Into Wealth.
          <br />
          <span className="text-eco-400">Build a Greener Future.</span>
        </p>

        {/* Loading / Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-3 p-0.5 border border-slate-700/80 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-eco-500 via-emerald-400 to-teal-300 transition-all duration-100 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-xs font-mono font-bold text-slate-400">
          Loading Simulation Engine... {progress}%
        </span>

        {/* Footer Attribution */}
        <div className="mt-12 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <span>🌱</span> Powered by Circular Economy
        </div>
      </div>
    </div>
  );
};
