import React from 'react';
import { useGame } from '../context/GameContext';
import { Trash2, RefreshCw, Truck, Factory, ShoppingCart, Zap, Sparkles } from 'lucide-react';

export const CityView: React.FC = () => {
  const { cityLevel, greenScore, setActiveTab } = useGame();

  const cityDetails: Record<number, { name: string; icon: string; desc: string; bgClass: string; elements: string[] }> = {
    1: {
      name: '🏡 Village',
      icon: '🏡',
      desc: 'A small rural village taking its first steps in eco-waste collection.',
      bgClass: 'from-amber-950/40 to-emerald-950/60',
      elements: ['🏡 Cottage Home', '🌾 Composting Patch', '🌳 Village Park']
    },
    2: {
      name: '🏘️ Eco Town',
      icon: '🏘️',
      desc: 'A vibrant town with active waste collection routes and basic sorting bins.',
      bgClass: 'from-slate-900 via-emerald-950/50 to-teal-950/60',
      elements: ['🏘️ Town Houses', '🏫 Recycling School', '🚛 Transport Depot']
    },
    3: {
      name: '🏙️ Circular City',
      icon: '🏙️',
      desc: 'A thriving city with dedicated recycling processing plants and paper mills.',
      bgClass: 'from-slate-900 via-teal-950/60 to-emerald-950/80',
      elements: ['🏙️ Commercial District', '🏭 Biogas & Plastic Plant', '🏢 Recycling HQ']
    },
    4: {
      name: '🌆 Smart Eco City',
      icon: '🌆',
      desc: 'A high-tech smart metropolis with automated sorters and solar grids.',
      bgClass: 'from-slate-950 via-emerald-900/60 to-blue-950/70',
      elements: ['🌆 Automated Towers', '☀️ Solar Array Power', '🤖 AI Sorting Hub']
    },
    5: {
      name: '🌍 Universal Green City',
      icon: '🌍',
      desc: 'The pinnacle of zero-waste sustainable circular economy living!',
      bgClass: 'from-emerald-950 via-teal-900 to-slate-950',
      elements: ['🌍 Vertical Forest Arcology', '💨 Wind & Solar Grid', '♻️ 100% Zero-Landfill Engine']
    }
  };

  const current = cityDetails[cityLevel] || cityDetails[1];

  const actions = [
    { id: 'collect', label: 'Collect', icon: Trash2, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { id: 'sort', label: 'Sort', icon: RefreshCw, color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    { id: 'transport', label: 'Transport', icon: Truck, color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    { id: 'recycle', label: 'Recycle', icon: Factory, color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
    { id: 'market', label: 'Market', icon: ShoppingCart, color: 'bg-gold-500/20 text-amber-300 border-amber-500/40' },
    { id: 'upgrade', label: 'Upgrade', icon: Zap, color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* City Banner & Visual Illustration */}
      <div className={`relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${current.bgClass} border border-slate-700/60 shadow-2xl overflow-hidden`}>
        {/* Floating eco sparkles */}
        <div className="absolute top-4 right-6 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-eco-500/40 text-xs font-bold text-eco-400">
          <Sparkles className="w-4 h-4" />
          <span>Green Score {greenScore}/100</span>
        </div>

        <div className="relative z-10 max-w-xl space-y-2">
          <div className="text-4xl sm:text-5xl mb-2">{current.icon}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{current.name}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{current.desc}</p>

          <div className="flex flex-wrap gap-2 pt-3">
            {current.elements.map((elem, idx) => (
              <span key={idx} className="bg-slate-900/80 px-3 py-1 rounded-full text-xs font-semibold text-eco-300 border border-eco-500/30">
                {elem}
              </span>
            ))}
          </div>
        </div>

        {/* Visual city sky SVG illustration background */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none text-9xl">
          {current.icon}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => setActiveTab(act.id)}
                className={`p-4 rounded-2xl border ${act.color} flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-bold text-xs text-white">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
