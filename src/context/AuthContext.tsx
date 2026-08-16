import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/game';

interface AuthConfig {
  googleConfigured: boolean;
  googleClientId: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  authConfig: AuthConfig;
  isLoading: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('w2w_local_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('w2w_auth_token'));
  const [authConfig, setAuthConfig] = useState<AuthConfig>({
    googleConfigured: Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Auth Config
  useEffect(() => {
    fetch('/api/auth/config')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setAuthConfig(data))
      .catch(() => {
        setAuthConfig({
          googleConfigured: Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
          googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || null,
        });
      });
  }, []);

  // Validate existing token
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (token.startsWith('local_')) {
      const savedUser = localStorage.getItem('w2w_local_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token expired or invalid');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        localStorage.setItem('w2w_local_user', JSON.stringify(data.user));
      })
      .catch(() => {
        const savedUser = localStorage.getItem('w2w_local_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            logout();
          }
        } else {
          logout();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    try {
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential }),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('w2w_auth_token', data.token);
          localStorage.setItem('w2w_local_user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          return;
        }
      } catch {
        // Fallback for static client mode
      }

      // Local Google user decoding fallback if offline/serverless
      let name = 'Eco Warrior';
      let email = 'player@wastetowealth.eco';
      let picture = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80';
      try {
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window.atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const parsed = JSON.parse(jsonPayload);
        if (parsed.name) name = parsed.name;
        if (parsed.email) email = parsed.email;
        if (parsed.picture) picture = parsed.picture;
      } catch {}

      const localUser: User = {
        id: `usr_${Date.now()}`,
        email,
        name,
        picture,
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const localToken = `local_token_${Date.now()}`;
      localStorage.setItem('w2w_auth_token', localToken);
      localStorage.setItem('w2w_local_user', JSON.stringify(localUser));
      setToken(localToken);
      setUser(localUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      try {
        const res = await fetch('/api/auth/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('w2w_auth_token', data.token);
          localStorage.setItem('w2w_local_user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          return;
        }
      } catch {
        // Fallback for static client mode
      }

      // Local Demo User
      const demoUser: User = {
        id: 'usr_demo_eco_warrior',
        email: 'demo@wastetowealth.eco',
        name: 'Eco Warrior (Demo)',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        isDemo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const localToken = `local_demo_${Date.now()}`;
      localStorage.setItem('w2w_auth_token', localToken);
      localStorage.setItem('w2w_local_user', JSON.stringify(demoUser));
      setToken(localToken);
      setUser(demoUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('w2w_auth_token');
    localStorage.removeItem('w2w_local_user');
    setToken(null);
    setUser(null);
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('w2w_local_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authConfig,
        isLoading,
        loginWithGoogle,
        loginDemo,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
