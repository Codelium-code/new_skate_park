import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Skater } from '../types';
import { storage } from '../utils/localStorage';

interface AuthContextType {
  currentUser: Skater | null;
  isAdminLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  adminLogin: (password: string) => boolean;
  logout: () => void;
  adminLogout: () => void;
  updateCurrentUser: (updates: Partial<Skater>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'admin123'; // In a real app, this would be more secure

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Skater | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Load auth state on mount
    const user = storage.getCurrentUser();
    const adminSession = storage.isAdminLoggedIn();
    setCurrentUser(user);
    setIsAdminLoggedIn(adminSession);
  }, []);

  const login = (email: string, password: string): boolean => {
    const skater = storage.getSkaterByEmail(email);
    if (skater && skater.password === password && skater.estado) {
      setCurrentUser(skater);
      storage.setCurrentUser(skater);
      return true;
    }
    return false;
  };

  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      storage.setAdminSession(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    storage.setCurrentUser(null);
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    storage.setAdminSession(false);
  };

  const updateCurrentUser = (updates: Partial<Skater>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      storage.setCurrentUser(updatedUser);
      storage.updateSkater(currentUser.id, updates);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdminLoggedIn,
      login,
      adminLogin,
      logout,
      adminLogout,
      updateCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};