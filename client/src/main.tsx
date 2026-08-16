<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppContent } from './App';
import { SoundProvider } from './context/SoundContext';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SoundProvider>
      <AuthProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </AuthProvider>
    </SoundProvider>
  </React.StrictMode>
);
=======
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
