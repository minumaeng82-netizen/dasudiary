
import React, { useState, useEffect } from 'react';
import { WidgetMain } from './components/WidgetMain.tsx';
import { LoginView } from './components/LoginView.tsx';
import { TenantJoinView } from './components/TenantJoinView.tsx';
import { PasswordChangeView } from './components/PasswordChangeView.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth.ts';
import { SettingsProvider } from './context/SettingsContext.tsx';

const AppContent: React.FC = () => {
  const { user, loading, tenantInfo, needsPasswordChange } = useAuth();
  const [view, setView] = useState<'auth' | 'password-change' | 'tenant' | 'widget'>('auth');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setView('auth');
      } else if (needsPasswordChange) {
        setView('password-change');
      } else if (!tenantInfo) {
        setView('tenant');
      } else {
        setView('widget');
      }
    }
  }, [user, loading, tenantInfo, needsPasswordChange]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white/80">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden select-none">
      {view === 'auth' && <LoginView />}
      {view === 'password-change' && <PasswordChangeView />}
      {view === 'tenant' && <TenantJoinView />}
      {view === 'widget' && <WidgetMain />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
