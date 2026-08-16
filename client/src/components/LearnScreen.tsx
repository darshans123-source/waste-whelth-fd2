import React from 'react';
import { BookOpen, RefreshCw, Trash2, Zap, Flame, Leaf, ArrowRight } from 'lucide-react';

export const LearnScreen: React.FC = () => {
  const topics = [
    {
      title: 'Waste Segregation',
      icon: Trash2,
      color: 'border-emerald-500/40 text-emerald-400',
      desc: 'Separating organic wet waste from dry recyclables (plastic, paper, glass, metal) at the source prevents cross-contamination and enables 90%+ recovery.'
    },
    {
      title: 'Mechanical Recycling',
      icon: RefreshCw,
      color: 'border-blue-500/40 text-blue-400',
      desc: 'Processing clean post-consumer plastic and glass into secondary granules and bottles reduces raw petroleum extraction and energy use by up to 70%.'
    },
    {
      title: 'Aerobic Composting',
      icon: Leaf,
      color: 'border-amber-500/40 text-amber-400',
      desc: 'Decomposing organic food scraps using oxygen creates rich bio-fertilizer that revitalizes soil microbiology and replaces chemical nitrogen fertilizers.'
    },
    {
      title: 'Anaerobic Biogas Digest',
      icon: Flame,
      color: 'border-orange-500/40 text-orange-400',
      desc: 'Fermenting organic waste without oxygen produces clean methane biogas for cooking, heating, and green electricity generation.'
    },
    {
      title: 'Resource Recovery',
      icon: Zap,
      color: 'border-purple-500/40 text-purple-400',
      desc: 'Extracting precious gold, copper, and rare earths from discarded electronic circuit boards protects finite geological mineral reserves.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-2 text-eco-400 font-extrabold text-xs uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Sustainability Knowledge Hub</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">Understanding Circular Economy</h2>
        <p className="text-slate-300 text-sm">
          Learn how turning waste into valuable assets protects ecosystems and combats global climate change.
        </p>
      </div>

      {/* Linear vs Circular Economy Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Linear Economy Card */}
        <div className="glass-card p-6 rounded-3xl border border-rose-500/30 bg-rose-950/10 space-y-3">
          <div className="text-xs font-extrabold text-rose-400 uppercase tracking-wider">Traditional Model</div>
          <h3 className="text-xl font-bold text-white">LINEAR ECONOMY ❌</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span>Take</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Make</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Use</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Throw Away</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Resources are extracted, manufactured into single-use items, and dumped into overflowing landfills or oceans.
          </p>
        </div>

        {/* Circular Economy Card */}
        <div className="glass-card p-6 rounded-3xl border border-eco-500/50 bg-eco-950/20 space-y-3">
          <div className="text-xs font-extrabold text-eco-400 uppercase tracking-wider">Sustainable Model</div>
          <h3 className="text-xl font-bold text-white">CIRCULAR ECONOMY ✅</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-eco-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span>Use</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Recover</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Recycle</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Make Again</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Materials are kept in continuous closed loops, eliminating waste and regenerating natural natural ecosystems.
          </p>
        </div>
      </div>

      {/* Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div key={idx} className={`glass-card p-5 rounded-3xl border ${t.color} space-y-3 shadow-md`}>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">{t.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{t.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
