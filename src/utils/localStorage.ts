import { Skater } from '../types';

const STORAGE_KEYS = {
  SKATERS: 'skatepark_skaters',
  CURRENT_USER: 'skatepark_current_user',
  ADMIN_SESSION: 'skatepark_admin_session'
};

export const storage = {
  // Skaters management
  getSkaters: (): Skater[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SKATERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading skaters from localStorage:', error);
      return [];
    }
  },

  saveSkaters: (skaters: Skater[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SKATERS, JSON.stringify(skaters));
    } catch (error) {
      console.error('Error saving skaters to localStorage:', error);
    }
  },

  addSkater: (skater: Skater): void => {
    const skaters = storage.getSkaters();
    skaters.push(skater);
    storage.saveSkaters(skaters);
  },

  updateSkater: (id: string, updates: Partial<Skater>): void => {
    const skaters = storage.getSkaters();
    const index = skaters.findIndex(s => s.id === id);
    if (index !== -1) {
      skaters[index] = { 
        ...skaters[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      storage.saveSkaters(skaters);
    }
  },

  deleteSkater: (id: string): void => {
    const skaters = storage.getSkaters();
    const filtered = skaters.filter(s => s.id !== id);
    storage.saveSkaters(filtered);
  },

  getSkaterByEmail: (email: string): Skater | null => {
    const skaters = storage.getSkaters();
    return skaters.find(s => s.email === email) || null;
  },

  isEmailTaken: (email: string, excludeId?: string): boolean => {
    const skaters = storage.getSkaters();
    return skaters.some(s => s.email === email && s.id !== excludeId);
  },

  // Authentication
  getCurrentUser: (): Skater | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading current user:', error);
      return null;
    }
  },

  setCurrentUser: (skater: Skater | null): void => {
    try {
      if (skater) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(skater));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  // Admin session
  isAdminLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  },

  setAdminSession: (isLoggedIn: boolean): void => {
    if (isLoggedIn) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  },

  // Statistics
  getRecentRegistrations: (days: number = 7): number => {
    const skaters = storage.getSkaters();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return skaters.filter(skater => 
      new Date(skater.createdAt) >= cutoffDate
    ).length;
  }
};