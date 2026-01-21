
import React, { createContext, useContext, useState } from 'react';
import { Settings } from '../types.ts';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('school_link_settings');
    return saved ? JSON.parse(saved) : {
      alwaysOnTop: false, // 웹에서는 의미 없음
      opacity: 100,
      autoLaunch: false,
      notifications: true
    };
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('school_link_settings', JSON.stringify(updated));
    
    // 웹 알림 권한 요청 (알림 설정 시)
    if (newSettings.notifications && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
