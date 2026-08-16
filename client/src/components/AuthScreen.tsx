import React from 'react';
import { useGame } from '../context/GameContext';
import { GoogleLogin } from '@react-oauth/google';
import { Leaf, ShieldAlert, Sparkles, UserCheck, Play } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const {
    loginWithDemo,
    loginWithGoogle,
    googleConfigured,
    user,
    loading
  } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-eco-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col items-center text-center relative z-10">
        {/* Header Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-eco-600 to-emerald-400 p-0.5 shadow-xl shadow-eco-500/20 mb-6 flex items-center justify-center transform hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Leaf className="w-10 h-10 text-eco-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Welcome to <span className="eco-gradient-text">Waste to Wealth</span> 🌱
        </h1>
        <p className="text-slate-300 text-sm font-medium mb-8">
          Build your recycling empire and create a greener future.
        </p>

        {/* User Card if already authenticated */}
        {user ? (
          <div className="w-full bg-slate-800/90 rounded-2xl p-4 border border-eco-500/30 flex items-center gap-4 mb-6">
            <img
              src={user.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + user.name}
              alt={user.name}
              className="w-14 h-14 rounded-full border-2 border-eco-400 object-cover shadow-md"
            />
            <div className="text-left overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs text-eco-400 font-bold uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Authenticated</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base truncate">{user.name}</h3>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        ) : null}

        {/* Google OAuth Login Button */}
        <div className="w-full flex flex-col gap-4 mb-6">
          {googleConfigured ? (
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    loginWithGoogle(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  console.error('Google Sign-In Failed');
                }}
                useOneTap
                theme="filled_blue"
                shape="pill"
                size="large"
                text="continue_with"
              />
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-left text-xs text-amber-200/90 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Google OAuth Configuration Note</span>
              </div>
              <p>
                Google Client ID is not configured in <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300">.env</code>.
              </p>
              <p className="text-slate-400 text-[11px]">
                To enable Google Login, set <code className="text-slate-300">GOOGLE_CLIENT_ID</code> in <code className="text-slate-300">.env</code>. You can test all full features immediately using <strong>Continue as Demo</strong>.
              </p>
            </div>
          )}

          {/* Demo Login Button */}
          <button
            onClick={loginWithDemo}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-gradient-to-r from-eco-500 to-emerald-600 hover:from-eco-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-eco-500/25 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Continue as Demo</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Demo mode creates a persistent local game state for quick evaluation.
        </p>
      </div>
    </div>
  );
};
