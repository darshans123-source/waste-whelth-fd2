import React, { useState } from 'react';
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
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

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
      case 'missions':
        return <MissionsScreen />;
      case 'achievements':
        return <AchievementsScreen />;
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
