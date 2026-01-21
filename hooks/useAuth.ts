
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  tenantInfo: any;
  loading: boolean;
  needsPasswordChange: boolean;
  login: (grade: string, classNum: string, password: string) => boolean;
  logout: () => void;
  joinTenant: (code: string) => void;
  changePassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('mock_user');
    const savedTenant = localStorage.getItem('mock_tenant');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTenant) setTenantInfo(JSON.parse(savedTenant));
    
    setLoading(false);
  }, []);

  const login = (grade: string, classNum: string, password: string) => {
    const userId = `u-${grade}-${classNum}`;
    const storedPasswords = JSON.parse(localStorage.getItem('user_passwords') || '{}');
    const currentPassword = storedPasswords[userId] || '0000';

    if (password !== currentPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    const userData = { 
      uid: userId, 
      grade, 
      classNum, 
      displayName: `${grade}학년 ${classNum}반`,
      role: 'member'
    };

    if (password === '0000') {
      setNeedsPasswordChange(true);
      setUser(userData); 
      return true;
    }

    setUser(userData);
    localStorage.setItem('mock_user', JSON.stringify(userData));
    return true;
  };

  const changePassword = (newPassword: string) => {
    if (!user) return;
    
    const storedPasswords = JSON.parse(localStorage.getItem('user_passwords') || '{}');
    storedPasswords[user.uid] = newPassword;
    localStorage.setItem('user_passwords', JSON.stringify(storedPasswords));
    
    localStorage.setItem('mock_user', JSON.stringify(user));
    setNeedsPasswordChange(false);
  };

  const logout = () => {
    setUser(null);
    setTenantInfo(null);
    setNeedsPasswordChange(false);
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_tenant');
  };

  const joinTenant = (code: string) => {
    const tenant = { id: 't1', schoolName: '서울미래고등학교', inviteCode: code };
    setTenantInfo(tenant);
    localStorage.setItem('mock_tenant', JSON.stringify(tenant));
  };

  return React.createElement(AuthContext.Provider, {
    value: { user, tenantInfo, loading, needsPasswordChange, login, logout, joinTenant, changePassword }
  }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
