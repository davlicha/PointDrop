import { useState, useEffect, createContext, useContext } from 'react';
import { login as loginApi, logout as logoutApi, isAuthenticated, getQrPayload } from '../services/authService';
import { getCurrentUserProfile } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Перевіряємо чи є збережений користувач
    const savedUser = localStorage.getItem('user');
    if (savedUser && isAuthenticated()) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const refreshUserProfile = async () => {
    try {
      const userProfile = await getCurrentUserProfile();
      setUser(userProfile);
      localStorage.setItem('user', JSON.stringify(userProfile));
      return userProfile;
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    const data = await loginApi({ email, password });

    // Отримуємо повний профіль користувача
    const userProfile = await getCurrentUserProfile();
    setUser(userProfile);
    localStorage.setItem('user', JSON.stringify(userProfile));

    return data;
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    getQrPayload,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
