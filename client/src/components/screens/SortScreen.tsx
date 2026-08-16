import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { WasteType } from '../../types/game';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface WasteItem {
  id: string;
  name: string;
  emoji: string;
  correctType: WasteType;
  hint: string;
}

const WASTE_ITEM_POOL: WasteItem[] = [
  { id: '1', name: 'Banana Peel', emoji: '🍌', correctType: 'organic', hint: 'Biodegradable fruit waste' },
  { id: '2', name: 'Plastic Soda Bottle', emoji: '🥤', correctType: 'plastic', hint: 'PET polymer container' },
  { id: '3', name: 'Office Document / Paper', emoji: '📄', correctType: 'paper', hint: 'Cellulose fibers' },
  { id: '4', name: 'Glass Beverage Bottle', emoji: '🍾', correctType: 'glass', hint: 'Silica glass container' },
  { id: '5', name: 'Soda Aluminum Can', emoji: '🥫', correctType: 'metal', hint: 'Recyclable metal alloy' },
  { id: '6', name: 'Discarded Smartphone', emoji: '📱', correctType: 'ewaste', hint: 'Circuitry & rare earth metals' },
  { id: '7', name: 'Concrete Brick / Paver', emoji: '🧱', correctType: 'construction', hint: 'Heavy masonry material' },
  { id: '8', name: 'Apple Core', emoji: '🍎', correctType: 'organic', hint: 'Compostable food scrap' },
  { id: '9', name: 'Plastic Milk Jug', emoji: '🧃', correctType: 'plastic', hint: 'HDPE plastic container' },
  { id: '10', name: 'Cardboard Box', emoji: '📦', correctType: 'paper', hint: 'Corrugated paper packaging' },
  { id: '11', name: 'Broken Glass Tumbler', emoji: '🥛', correctType: 'glass', hint: 'Vitreous glass material' },
  { id: '12', name: 'Metal Nut & Bolt', emoji: '🔩', correctType: 'metal', hint: 'High-grade steel/iron' },
  { id: '13', name: 'Dead Battery Pack', emoji: '🔋', correctType: 'ewaste', hint: 'Hazardous chemical e-waste' },
  { id: '14', name: 'Broken Ceramic Tile', emoji: '🪨', correctType: 'construction', hint: 'Demolition aggregate' },
];

const BINS: { type: WasteType; label: string; icon: string; bg: string; border: string; text: string }[] = [
  { type: 'organic', label: 'ORGANIC', icon: '🟢', bg: 'bg-emerald-950/40', border: 'border-emerald-500/50 hover:border-emerald-400', text: 'text-emerald-300' },
  { type: 'plastic', label: 'PLASTIC', icon: '🔵', bg: 'bg-blue-950/40', border: 'border-blue-500/50 hover:border-blue-400', text: 'text-blue-300' },
  { type: 'paper', label: 'PAPER', icon: '🟡', bg: 'bg-amber-950/40', border: 'border-amber-500/50 hover:border-amber-400', text: 'text-amber-300' },
  { type: 'glass', label: 'GLASS', icon: '⚪', bg: 'bg-slate-800/40', border: 'border-slate-400/50 hover:border-slate-300', text: 'text-slate-200' },
  { type: 'metal', label: 'METAL', icon: '⚫', bg: 'bg-zinc-900/60', border: 'border-zinc-500/50 hover:border-zinc-300', text: 'text-zinc-300' },
  { type: 'ewaste', label: 'E-WASTE', icon: '🔴', bg: 'bg-rose-950/40', border: 'border-rose-500/50 hover:border-rose-400', text: 'text-rose-300' },
  { type: 'construction', label: 'CONSTRUCTION', icon: '🟤', bg: 'bg-amber-950/30', border: 'border-stone-500/50 hover:border-stone-400', text: 'text-amber-600' },
];

export const SortScreen: React.FC = () => {
  const { gameState, submitSortResult } = useGame();

  const [currentRoundItems, setCurrentRoundItems] = useState<WasteItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [roundStats, setRoundStats] = useState<{ correct: number; wrong: number; totalXP: number }>({
    correct: 0,
    wrong: 0,
    totalXP: 0,
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const startNewRound = () => {
    // Shuffle and pick 10 random items
    const shuffled = [...WASTE_ITEM_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
    setCurrentRoundItems(shuffled);
    setCurrentIndex(0);
    setFeedback(null);
    setRoundStats({ correct: 0, wrong: 0, totalXP: 0 });
    setIsGameOver(false);
  };

  useEffect(() => {
    startNewRound();
  }, []);

  const currentItem = currentRoundItems[currentIndex];

  const handleSort = async (binType: WasteType) => {
    if (!currentItem || feedback) return;

    const isCorrect = currentItem.correctType === binType;
    const sorterLevel = gameState?.upgrades.sorterLevel || 1;
    const bonus = sorterLevel === 3 ? 1.6 : sorterLevel === 2 ? 1.25 : 1.0;
    const xpDelta = isCorrect ? Math.round(10 * bonus) : -5;

    setFeedback({
      isCorrect,
      text: isCorrect
        ? `✅ Correct Sorting! +${xpDelta} XP (+Green Score)`
        : `❌ Wrong Bin! It belongs to ${currentItem.correctType.toUpperCase()} (${xpDelta} XP)`,
    });

    await submitSortResult(isCorrect);

    setRoundStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      totalXP: prev.totalXP + xpDelta,
    }));

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < currentRoundItems.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsGameOver(true);
      }
    }, 1100);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">♻️</span>
            <h2 className="text-2xl font-black text-white">Interactive Waste Sorting Mini-Game</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Drag or click items into their dedicated recycling bins. Accuracy directly boosts your city Green Score!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-300">
            Item {currentIndex + 1} / {currentRoundItems.length || 10}
          </div>
          <Button variant="secondary" size="sm" onClick={startNewRound} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            New Round
          </Button>
        </div>
      </div>

      {/* Main Game Stage */}
      {!isGameOver ? (
        <div className="space-y-6">
          {/* Active Item Conveyor Card */}
          <Card className="flex flex-col items-center justify-center py-8 text-center relative overflow-hidden" glow="eco">
            {currentItem ? (
              <div className="animate-scale-up space-y-3">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-slate-800/80 border-2 border-eco-500/40 flex items-center justify-center text-6xl shadow-2xl mx-auto animate-bounce-subtle">
                  {currentItem.emoji}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{currentItem.name}</h3>
                  <p className="text-xs text-eco-400 font-semibold">{currentItem.hint}</p>
                </div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  👉 Click the correct bin below
                </div>
              </div>
            ) : (
              <div className="text-slate-400">Loading items...</div>
            )}

            {/* Instant Feedback Overlay */}
            {feedback && (
              <div
                className={`absolute inset-0 flex items-center justify-center p-6 backdrop-blur-md font-black text-lg md:text-xl transition-all animate-fade-in ${
                  feedback.isCorrect
                    ? 'bg-emerald-950/90 text-emerald-300'
                    : 'bg-rose-950/90 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-400 animate-bounce" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              </div>
            )}
          </Card>

          {/* 7 Color-Coded Segregation Bins */}
          <div>
            <h4 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3 text-center">
              Available Recycling Bins
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {BINS.map((bin) => (
                <button
                  key={bin.type}
                  onClick={() => handleSort(bin.type)}
                  disabled={Boolean(feedback)}
                  className={`p-4 rounded-3xl border-2 ${bin.bg} ${bin.border} flex flex-col items-center justify-between text-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 shadow-lg group`}
                >
                  <span className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-200">
                    {bin.icon}
                  </span>
                  <span className={`text-xs font-black tracking-wide ${bin.text}`}>
                    {bin.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                    Drop Bin
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Round Summary Modal Card */
        <Card className="text-center py-10 space-y-6 max-w-lg mx-auto" glow="gold">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 text-4xl flex items-center justify-center mx-auto shadow-2xl">
            🏆
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">Round Completed!</h3>
            <p className="text-xs text-slate-300 mt-1">Here is your waste segregation performance report</p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Accuracy</span>
              <div className="text-xl font-black text-eco-400 font-mono">
                {Math.round((roundStats.correct / (roundStats.correct + roundStats.wrong || 1)) * 100)}%
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Correct</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {roundStats.correct} / 10
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Net XP</span>
              <div className="text-xl font-black text-sky-400 font-mono">
                +{roundStats.totalXP} XP
              </div>
            </div>
          </div>

          <Button variant="gold" size="lg" className="w-full" onClick={startNewRound} icon={<Sparkles className="w-5 h-5 text-slate-950" />}>
            CONTINUE SORTING
          </Button>
        </Card>
      )}
    </div>
  );
};
