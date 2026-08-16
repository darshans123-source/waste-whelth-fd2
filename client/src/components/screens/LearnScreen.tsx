import React, { useState } from 'react';
import { GraduationCap, ArrowRight, RefreshCw, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';

export const LearnScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'circular' | 'concepts'>('circular');

  const concepts = [
    {
      title: 'Waste Segregation',
      icon: '🗑️',
      summary: 'Separating dry, wet, and hazardous wastes at source.',
      detail: 'Sorting materials at home and offices prevents cross-contamination, allowing 90%+ of plastics, papers, and metals to be successfully recovered.',
    },
    {
      title: 'Composting',
      icon: '🌱',
      summary: 'Aerobic biological decomposition of organic matter.',
      detail: 'Converts kitchen scraps, yard clippings, and food waste into nutrient-dense humus fertilizer that rejuvenates depleted soil without chemical toxins.',
    },
    {
      title: 'Biogas Generation',
      icon: '🔥',
      summary: 'Anaerobic digestion producing renewable energy.',
      detail: 'Microorganisms break down organic wastes in oxygen-free reactors to produce methane gas for cooking, electricity, and clean transport fuel.',
    },
    {
      title: 'Resource Recovery',
      icon: '⚙️',
      summary: 'Extracting precious metals and minerals from e-waste.',
      detail: '1 ton of discarded smartphones yields more high-purity gold, silver, and copper than 10 tons of mined geological ore.',
    },
    {
      title: 'C&D Recycling',
      icon: '🧱',
      summary: 'Upcycling concrete, bricks, and masonry rubble.',
      detail: 'Demolition waste is crushed and screened into structural road base aggregates and eco-paver blocks, saving natural river sand.',
    },
    {
      title: 'Solar & Clean Energy',
      icon: '☀️',
      summary: 'Powering circular logistics with zero emissions.',
      detail: 'Replacing fossil fuel electricity with solar rooftops cuts logistics operating costs by up to 60% and eliminates carbon footprints.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h2 className="text-2xl font-black text-white">Circular Economy Knowledge Hub</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Discover the real-world science and principles behind turning municipal waste into valuable global wealth.
          </p>
        </div>
      </div>

      {/* Comparison: Linear vs Circular Economy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Linear Economy Card */}
        <Card className="border-rose-500/30 bg-rose-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-rose-300 flex items-center gap-2">
              <span>🛑</span> Linear Economy (Traditional)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Unsustainable
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The traditional take-make-dispose industrial model extracts finite natural resources and rapidly discards them into overburdened landfills and oceans.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-black text-slate-300">
            <span className="text-center">⛏️<br />Take</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="text-center">🏭<br />Make</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="text-center">🛒<br />Use</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="text-center text-rose-400">🗑️<br />Landfill</span>
          </div>
        </Card>

        {/* Circular Economy Card */}
        <Card className="border-eco-500/40 bg-eco-950/30 space-y-4 eco-glow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-eco-300 flex items-center gap-2">
              <span>♻️</span> Circular Economy (Waste to Wealth)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-eco-500/20 text-eco-300 border border-eco-500/30">
              Zero Waste
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            A restorative industrial system where waste becomes biological nutrients or technical raw materials, looping indefinitely with zero landfill footprint.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-black text-emerald-300 flex-wrap gap-1">
            <span className="text-center">🛒<br />Use</span>
            <ArrowRight className="w-3.5 h-3.5 text-eco-400" />
            <span className="text-center">🔍<br />Recover</span>
            <ArrowRight className="w-3.5 h-3.5 text-eco-400" />
            <span className="text-center">🔄<br />Reuse</span>
            <ArrowRight className="w-3.5 h-3.5 text-eco-400" />
            <span className="text-center">♻️<br />Recycle</span>
            <ArrowRight className="w-3.5 h-3.5 text-eco-400" />
            <span className="text-center">🏭<br />Remake</span>
          </div>
        </Card>
      </div>

      {/* Core Circular Concepts Grid */}
      <div>
        <h3 className="text-base font-black text-white mb-3">
          Key Resource Recovery Disciplines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((c, i) => (
            <Card key={i} className="flex flex-col justify-between space-y-3" hoverEffect>
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-3xl">{c.icon}</span>
                  <h4 className="font-black text-base text-white">{c.title}</h4>
                </div>
                <p className="text-xs font-semibold text-eco-400 mb-2">{c.summary}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{c.detail}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
