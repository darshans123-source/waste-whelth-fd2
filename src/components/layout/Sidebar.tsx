import React from 'react';
import {
  Home,
  Trash2,
  Boxes,
  Truck,
  Factory,
  ShoppingBag,
  ArrowUpCircle,
  Target,
  Trophy,
  Leaf,
  GraduationCap,
  Medal,
  User,
  Settings,
} from 'lucide-react';
import { ScreenTab } from '../../types/game';
import { useGame } from '../../context/GameContext';

interface SidebarProps {
  activeTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { gameState } = useGame();

  const navItems: { id: ScreenTab; label: string; icon: any; badge?: number | string; badgeColor?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'collect', label: 'Collect', icon: Trash2 },
    { id: 'sort', label: 'Sort Mini-Game', icon: Boxes },
    { id: 'transport', label: 'Transport', icon: Truck },
    { id: 'recycle', label: 'Recycle Plant', icon: Factory },
    { id: 'market', label: 'Marketplace', icon: ShoppingBag },
    { id: 'upgrade', label: 'Upgrade Shop', icon: ArrowUpCircle },
    {
      id: 'missions',
      label: 'Missions',
      icon: Target,
      badge: gameState?.missions.filter((m) => m.completed && !m.claimed).length || undefined,
      badgeColor: 'bg-gold-500 text-slate-950 font-black',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      badge: gameState?.achievements.filter((a) => a.unlocked).length,
      badgeColor: 'bg-eco-500/30 text-eco-300 font-bold',
    },
    { id: 'greenscore', label: 'Green Score', icon: Leaf },
    { id: 'learn', label: 'Learn & Circular', icon: GraduationCap },
    { id: 'leaderboard', label: 'Leaderboard', icon: Medal },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-700/60 hidden md:flex flex-col h-[calc(100vh-65px)] sticky top-[65px] p-4 select-none overflow-y-auto">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-eco-600 to-emerald-500 text-white shadow-lg shadow-eco-500/20 border border-eco-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && Number(item.badge) > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Storage meter preview in sidebar */}
      {gameState && (
        <div className="mt-auto pt-4 border-t border-slate-700/60">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex justify-between font-bold text-slate-300 mb-1">
              <span>Warehouse Load</span>
              <span className="font-mono text-eco-400">
                {Object.values(gameState.collectedWaste).reduce((a, b) => a + b, 0)} kg
              </span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-eco-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (Object.values(gameState.collectedWaste).reduce((a, b) => a + b, 0) /
                      (gameState.upgrades.storageLevel === 3
                        ? 3000
                        : gameState.upgrades.storageLevel === 2
                        ? 1200
                        : 500)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
