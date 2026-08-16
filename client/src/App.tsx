import React, { useState } from 'react';
<<<<<<< HEAD
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
=======
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GameProvider, useGame } from './context/GameContext';
import { Splash } from './components/Splash';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { CollectionScreen } from './components/CollectionScreen';
import { SortingMiniGame } from './components/SortingMiniGame';
import { TransportScreen } from './components/TransportScreen';
import { RecyclingScreen } from './components/RecyclingScreen';
import { MarketScreen } from './components/MarketScreen';
import { UpgradesScreen } from './components/UpgradesScreen';
import { MissionsScreen } from './components/MissionsScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { GreenScoreGauge } from './components/GreenScoreGauge';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { LearnScreen } from './components/LearnScreen';
import { ProfileSettings } from './components/ProfileSettings';
import { RandomEventPopup } from './components/RandomEventPopup';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const MainApp: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, activeTab, showTutorial, toasts, loading } = useGame();

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-eco-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading Waste to Wealth...</span>
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

<<<<<<< HEAD
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
=======
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'collect':
        return <CollectionScreen />;
      case 'sort':
        return <SortingMiniGame />;
      case 'transport':
        return <TransportScreen />;
      case 'recycle':
        return <RecyclingScreen />;
      case 'market':
        return <MarketScreen />;
      case 'upgrade':
        return <UpgradesScreen />;
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
      case 'missions':
        return <MissionsScreen />;
      case 'achievements':
        return <AchievementsScreen />;
<<<<<<< HEAD
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
=======
      case 'green-score':
        return <GreenScoreGauge />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'learn':
        return <LearnScreen />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-eco-500 selection:text-slate-950">
      {/* Top Header Stats Bar */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 relative">
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-12 overflow-x-hidden">
          {renderTabContent()}
        </main>
      </div>

      {/* Onboarding Modal Tutorial */}
      {showTutorial && <OnboardingModal />}

      {/* Random Climate Event Popup */}
      <RandomEventPopup />

      {/* Global Toast Notifications Container */}
      <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl glass-panel border shadow-2xl flex items-start gap-3 animate-fadeIn ${
              toast.type === 'success'
                ? 'border-eco-500/50 bg-eco-950/80 text-eco-200'
                : toast.type === 'error'
                ? 'border-rose-500/50 bg-rose-950/80 text-rose-200'
                : toast.type === 'warning'
                ? 'border-amber-500/50 bg-amber-950/80 text-amber-200'
                : 'border-blue-500/50 bg-blue-950/80 text-blue-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-eco-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="text-xs font-bold leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function App() {
  // Use placeholder Google Client ID if not configured in .env so GoogleOAuthProvider does not crash
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '123456789-placeholder.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GameProvider>
        <MainApp />
      </GameProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
