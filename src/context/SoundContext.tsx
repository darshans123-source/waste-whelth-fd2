import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../audio/soundManager';

interface SoundContextType {
  soundEnabled: boolean;
  musicEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  playClick: () => void;
  playCoin: () => void;
  playCollect: () => void;
  playSortCorrect: () => void;
  playSortWrong: () => void;
  playTransport: () => void;
  playRecycle: () => void;
  playLevelUp: () => void;
  playAchievement: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('w2w_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('w2w_music_enabled');
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    soundManager.setSoundEnabled(soundEnabled);
    localStorage.setItem('w2w_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    soundManager.setMusicEnabled(musicEnabled);
    localStorage.setItem('w2w_music_enabled', String(musicEnabled));
  }, [musicEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    soundManager.playClick();
  };

  const toggleMusic = () => {
    setMusicEnabled((prev) => !prev);
    soundManager.playClick();
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        musicEnabled,
        toggleSound,
        toggleMusic,
        playClick: () => soundManager.playClick(),
        playCoin: () => soundManager.playCoin(),
        playCollect: () => soundManager.playCollect(),
        playSortCorrect: () => soundManager.playSortCorrect(),
        playSortWrong: () => soundManager.playSortWrong(),
        playTransport: () => soundManager.playTransport(),
        playRecycle: () => soundManager.playRecycle(),
        playLevelUp: () => soundManager.playLevelUp(),
        playAchievement: () => soundManager.playAchievement(),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};
