import React from 'react';
import { Home, Trash2, Boxes, ShoppingBag, ArrowUpCircle, Menu } from 'lucide-react';
import { ScreenTab } from '../../types/game';

interface BottomNavProps {
  activeTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onOpenMoreMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, onOpenMoreMenu }) => {
  const primaryTabs: { id: ScreenTab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'collect', label: 'Collect', icon: Trash2 },
    { id: 'sort', label: 'Sort', icon: Boxes },
    { id: 'market', label: 'Market', icon: ShoppingBag },
    { id: 'upgrade', label: 'Upgrade', icon: ArrowUpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-panel border-t border-slate-700/80 px-2 py-2 select-none">
      <div className="flex items-center justify-around">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-eco-400 font-extrabold scale-105' : 'text-slate-400 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenMoreMenu}
          className="flex flex-col items-center justify-center p-2 text-slate-400 rounded-2xl font-medium"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1">More</span>
        </button>
      </div>
    </nav>
  );
};
