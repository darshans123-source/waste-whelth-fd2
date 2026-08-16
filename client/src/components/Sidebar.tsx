import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Home,
  Trash2,
  RefreshCw,
  Truck,
  Factory,
  ShoppingCart,
  Zap,
  Target,
  Trophy,
  Leaf,
  BookOpen,
  User,
  Settings
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, missions } = useGame();

  const pendingMissionsCount = missions.filter(m => m.completed && !m.claimed).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'collect', label: 'Collect', icon: Trash2, badge: null },
    { id: 'sort', label: 'Sort Waste', icon: RefreshCw, badge: null },
    { id: 'transport', label: 'Transport', icon: Truck, badge: null },
    { id: 'recycle', label: 'Recycle', icon: Factory, badge: null },
    { id: 'market', label: 'Market', icon: ShoppingCart, badge: null },
    { id: 'upgrade', label: 'Upgrades', icon: Zap, badge: null },
    { id: 'missions', label: 'Missions', icon: Target, badge: pendingMissionsCount > 0 ? pendingMissionsCount : null },
    { id: 'achievements', label: 'Achievements', icon: Trophy, badge: null },
    { id: 'green-score', label: 'Green Score', icon: Leaf, badge: null },
    { id: 'learn', label: 'Learn', icon: BookOpen, badge: null },
    { id: 'profile', label: 'Profile & Settings', icon: User, badge: null },
  ];

  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'collect', label: 'Collect', icon: Trash2 },
    { id: 'sort', label: 'Sort', icon: RefreshCw },
    { id: 'market', label: 'Market', icon: ShoppingCart },
    { id: 'upgrade', label: 'Upgrade', icon: Zap },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800 h-[calc(100vh-57px)] sticky top-[57px] p-3 overflow-y-auto shrink-0 select-none">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-slate-950 shadow-md shadow-eco-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-eco-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? 'text-eco-400 scale-110' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
