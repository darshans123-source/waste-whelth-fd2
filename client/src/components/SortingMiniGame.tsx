import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundFx } from '../utils/audioEngine';
import { RefreshCw, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';

interface WasteItem {
  id: string;
  name: string;
  emoji: string;
  type: string;
}

const ITEMS_POOL: WasteItem[] = [
  { id: '1', name: 'Banana Peel', emoji: '🍌', type: 'organic' },
  { id: '2', name: 'Apple Core', emoji: '🍎', type: 'organic' },
  { id: '3', name: 'Plastic Soda Bottle', emoji: '🥤', type: 'plastic' },
  { id: '4', name: 'Takeout Container', emoji: '🍱', type: 'plastic' },
  { id: '5', name: 'Old Newspaper', emoji: '📄', type: 'paper' },
  { id: '6', name: 'Cardboard Box', emoji: '📦', type: 'paper' },
  { id: '7', name: 'Glass Milk Bottle', emoji: '🍾', type: 'glass' },
  { id: '8', name: 'Jar Lid', emoji: '🏺', type: 'glass' },
  { id: '9', name: 'Soda Metal Can', emoji: '🥫', type: 'metal' },
  { id: '10', name: 'Steel Pipe', emoji: '🔩', type: 'metal' },
  { id: '11', name: 'Broken Smartphone', emoji: '📱', type: 'ewaste' },
  { id: '12', name: 'Computer Circuit Board', emoji: '💻', type: 'ewaste' },
  { id: '13', name: 'Concrete Brick', emoji: '🧱', type: 'construction' },
  { id: '14', name: 'Tile Shard', emoji: '🪨', type: 'construction' }
];

const BINS = [
  { id: 'organic', name: 'Organic', emoji: '🟢', color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' },
  { id: 'plastic', name: 'Plastic', emoji: '🔵', color: 'border-blue-500/50 bg-blue-950/40 text-blue-300' },
  { id: 'paper', name: 'Paper', emoji: '🟡', color: 'border-amber-500/50 bg-amber-950/40 text-amber-300' },
  { id: 'glass', name: 'Glass', emoji: '⚪', color: 'border-slate-300/50 bg-slate-800/40 text-slate-200' },
  { id: 'metal', name: 'Metal', emoji: '⚫', color: 'border-slate-500/50 bg-slate-900/60 text-slate-300' },
  { id: 'ewaste', name: 'E-Waste', emoji: '🔴', color: 'border-rose-500/50 bg-rose-950/40 text-rose-300' },
  { id: 'construction', name: 'Construction', emoji: '🟤', color: 'border-stone-500/50 bg-stone-900/60 text-stone-300' }
];

export const SortingMiniGame: React.FC = () => {
  const { submitSortScore } = useGame();
  
  const [queue, setQueue] = useState<WasteItem[]>(() => [...ITEMS_POOL].sort(() => 0.5 - Math.random()).slice(0, 8));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  const currentItem = queue[currentIndex];

  const handleBinSelect = (binId: string) => {
    if (isFinished || !currentItem) return;

    if (currentItem.type === binId) {
      soundFx.playSortCorrect();
      setCorrectCount(prev => prev + 1);
      setFeedback({ type: 'correct', text: '✅ Correct Sorting! (+10 XP)' });
    } else {
      soundFx.playSortWrong();
      setWrongCount(prev => prev + 1);
      setFeedback({ type: 'wrong', text: `❌ Wrong Bin! (${currentItem.name} goes to ${currentItem.type.toUpperCase()})` });
    }

    setSelectedItem(null);

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= queue.length) {
        setIsFinished(true);
        submitSortScore(correctCount + (currentItem.type === binId ? 1 : 0), wrongCount + (currentItem.type !== binId ? 1 : 0));
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 900);
  };

  const handleRestart = () => {
    setQueue([...ITEMS_POOL].sort(() => 0.5 - Math.random()).slice(0, 8));
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>Interactive Sorting Mini-Game</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Segregate Waste Items</h2>
          <p className="text-slate-300 text-sm">
            Drag & drop or tap the waste item then tap the corresponding bin.
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Round</span>
        </button>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Item Card Container */}
          <div className="glass-card p-8 rounded-3xl border border-slate-700 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
            {/* Round progress indicator */}
            <div className="absolute top-4 left-4 text-xs font-extrabold text-slate-400">
              Item {currentIndex + 1} of {queue.length}
            </div>

            {/* Live Feedback Toast */}
            {feedback && (
              <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-xs font-extrabold shadow-lg animate-bounce ${
                feedback.type === 'correct' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
              }`}>
                {feedback.text}
              </div>
            )}

            {/* Current Waste Emoji & Name */}
            {currentItem && (
              <div
                onClick={() => setSelectedItem(currentItem)}
                className={`cursor-pointer transform hover:scale-110 transition-all p-6 rounded-3xl bg-slate-900/80 border-2 ${
                  selectedItem ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-slate-800'
                }`}
              >
                <div className="text-7xl mb-3 animate-float">{currentItem.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-1">{currentItem.name}</h3>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Tap to select item
                </span>
              </div>
            )}
          </div>

          {/* Bins Grid */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
              Select Correct Recycling Bin
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {BINS.map(bin => (
                <button
                  key={bin.id}
                  onClick={() => handleBinSelect(bin.id)}
                  className={`p-4 rounded-2xl border ${bin.color} flex flex-col items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md`}
                >
                  <span className="text-2xl">{bin.emoji}</span>
                  <span className="font-bold text-xs">{bin.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Round Summary Card */
        <div className="glass-panel p-8 rounded-3xl border border-slate-700 text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-eco-500/20 border border-eco-500/40 text-eco-400 flex items-center justify-center mx-auto text-3xl">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-white">Sorting Round Complete!</h3>
            <p className="text-slate-300 text-sm">Great job keeping recyclable materials out of landfills.</p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-bold">Accuracy</div>
              <div className="text-xl font-extrabold text-eco-400">
                {Math.round((correctCount / queue.length) * 100)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold">Correct</div>
              <div className="text-xl font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{correctCount}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold">Wrong</div>
              <div className="text-xl font-extrabold text-rose-400 flex items-center justify-center gap-1">
                <XCircle className="w-4 h-4" />
                <span>{wrongCount}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="py-3.5 px-8 rounded-full font-bold text-sm bg-gradient-to-r from-eco-500 to-emerald-500 hover:from-eco-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-eco-500/25"
          >
            Play Next Round ♻️
          </button>
        </div>
      )}
    </div>
  );
};
