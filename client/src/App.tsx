import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useGame } from './context/GameContext';
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { TutorialModal } from './components/screens/TutorialModal';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { RandomEventModal } from './components/events/RandomEventModal';
import { Modal } from './components/common/Modal';

// Screens
import { DashboardScreen } from './components/screens/DashboardScreen';
import { CollectScreen } from './components/screens/CollectScreen';
import { SortScreen } from './components/screens/SortScreen';
import { TransportScreen } from './components/screens/TransportScreen';
import { RecycleScreen } from './components/screens/RecycleScreen';
import { MarketScreen } from './components/screens/MarketScreen';
import { UpgradeScreen } from './components/screens/UpgradeScreen';
import { MissionsScreen } from './components/screens/MissionsScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { GreenScoreScreen } from './components/screens/GreenScoreScreen';
import { LearnScreen } from './components/screens/LearnScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

import { ScreenTab } from './types/game';
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
  Settings as SettingsIcon,
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { gameState, activeTab, setActiveTab, toasts, removeToast } = useGame();

  const [hasFinishedSplash, setHasFinishedSplash] = useState<boolean>(() => {
    return sessionStorage.getItem('w2w_splash_done') === 'true';
  });

  const [showMoreMobileMenu, setShowMoreMobileMenu] = useState<boolean>(false);
  const [dismissedEventId, setDismissedEventId] = useState<string | null>(null);

  if (!hasFinishedSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          sessionStorage.setItem('w2w_splash_done', 'true');
          setHasFinishedSplash(true);
        }}
      />
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-eco-400 font-black text-xl select-none">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-spin-slow">♻️</span>
          <span>Loading Waste to Wealth...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen />;
      case 'collect':
        return <CollectScreen />;
      case 'sort':
        return <SortScreen />;
      case 'transport':
        return <TransportScreen />;
      case 'recycle':
        return <RecycleScreen />;
      case 'market':
        return <MarketScreen />;
      case 'upgrade':
        return <UpgradeScreen />;
      case 'missions':
        return <MissionsScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'greenscore':
        return <GreenScoreScreen />;
      case 'learn':
        return <LearnScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const allNavLinks: { id: ScreenTab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'collect', label: 'Waste Collection', icon: Trash2 },
    { id: 'sort', label: 'Sorting Mini-Game', icon: Boxes },
    { id: 'transport', label: 'Fleet Transport', icon: Truck },
    { id: 'recycle', label: 'Recycling Plants', icon: Factory },
    { id: 'market', label: 'Commodity Market', icon: ShoppingBag },
    { id: 'upgrade', label: 'Upgrade Shop', icon: ArrowUpCircle },
    { id: 'missions', label: 'Daily Missions', icon: Target },
    { id: 'achievements', label: 'Hall of Achievements', icon: Trophy },
    { id: 'greenscore', label: 'Green Score Index', icon: Leaf },
    { id: 'learn', label: 'Learn Circular Economy', icon: GraduationCap },
    { id: 'leaderboard', label: 'Global Leaderboard', icon: Medal },
    { id: 'profile', label: 'Manager Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-eco-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Dynamic Content Main Area */}
        <main className="flex-1 p-4 md:p-6 max-w-full overflow-x-hidden">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMoreMenu={() => setShowMoreMobileMenu(true)}
      />

      {/* Mobile More Navigation Drawer Modal */}
      <Modal
        isOpen={showMoreMobileMenu}
        onClose={() => setShowMoreMobileMenu(false)}
        title="Navigation Menu"
        icon={<Home className="w-5 h-5" />}
      >
        <div className="grid grid-cols-2 gap-2.5 py-2">
          {allNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMoreMobileMenu(false);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition text-left ${
                  isActive
                    ? 'bg-eco-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* First-Time User Tutorial Modal */}
      {gameState && !gameState.hasCompletedTutorial && (
        <TutorialModal isOpen={true} onClose={() => {}} />
      )}

      {/* Live Random Event Alert Modal */}
      {gameState?.activeEvent && dismissedEventId !== gameState.activeEvent.id && (
        <RandomEventModal
          event={gameState.activeEvent}
          onDismiss={() => setDismissedEventId(gameState.activeEvent?.id || null)}
        />
      )}

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
