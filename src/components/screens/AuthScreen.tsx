import React, { useEffect, useRef } from 'react';
import { Leaf, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const AuthScreen: React.FC = () => {
  const { authConfig, loginWithGoogle, loginDemo, isLoading } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Render official Google Sign-In button if configured and Google SDK is loaded
    if (authConfig.googleConfigured && authConfig.googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: authConfig.googleClientId,
          callback: (response: any) => {
            if (response.credential) {
              loginWithGoogle(response.credential);
            }
          },
        });

        if (googleBtnRef.current) {
          (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            shape: 'pill',
            width: 320,
            text: 'continue_with',
          });
        }
      } catch (err) {
        console.error('Failed to initialize Google Sign-In SDK:', err);
      }
    }
  }, [authConfig, loginWithGoogle]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-eco-950 select-none">
      <div className="max-w-md w-full glass-panel border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative text-center">
        {/* Glow circle */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-eco-500 to-emerald-400 p-0.5 mx-auto mb-6 shadow-xl shadow-eco-500/20">
          <div className="w-full h-full bg-slate-950/80 rounded-[22px] flex items-center justify-center text-3xl">
            🌱
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide mb-2">
          Welcome to <span className="text-eco-400">Waste to Wealth</span>
        </h2>
        <p className="text-sm text-slate-300 mb-8 leading-relaxed">
          Build your recycling empire and create a greener future with the circular economy.
        </p>

        {/* Primary Auth Actions */}
        <div className="space-y-4 flex flex-col items-center justify-center">
          {/* Google Sign-In Button Container */}
          {authConfig.googleConfigured ? (
            <div className="w-full flex justify-center py-1">
              <div ref={googleBtnRef} className="min-h-[44px]" />
            </div>
          ) : (
            <div className="w-full text-left p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1 text-amber-400">
                <Info className="w-4 h-4 shrink-0" />
                <span>Google OAuth Status: Local Development</span>
              </div>
              <p className="text-slate-300 leading-normal">
                To enable live Google Sign-In, add your <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> to your <code>.env</code> file.
              </p>
            </div>
          )}

          {/* Demo Login Button */}
          <div className="w-full pt-2">
            <Button
              variant="gold"
              size="lg"
              className="w-full py-4 text-base"
              onClick={loginDemo}
              disabled={isLoading}
              icon={<Sparkles className="w-5 h-5 text-slate-950" />}
            >
              {isLoading ? 'Starting Simulation...' : 'Continue as Demo Manager'}
            </Button>
            <p className="text-[11px] text-slate-400 mt-2 font-semibold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-eco-400" />
              Instant Sandbox Mode • Full game features enabled
            </p>
          </div>
        </div>

        {/* Circular Economy Values Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-around text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-eco-400" /> Zero Waste
          </span>
          <span>•</span>
          <span>♻️ 100% Circular</span>
          <span>•</span>
          <span>⚡ Clean Energy</span>
        </div>
      </div>
    </div>
  );
};
