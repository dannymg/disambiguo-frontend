'use client'

import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, register, checkIsAnalista } from './auth-service';

import User from '@/types/entities';

interface AuthContextType {
  user: any | null;
  isAnalista: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAnalista, setIsAnalista] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          setIsAnalista(await checkIsAnalista());
        } catch {
          logout();
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const data = await login(email, password);
    setUser(data.user);
    setIsAnalista(await checkIsAnalista());
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    const data = await register(username, email, password);
    setUser(data.user);
    setIsAnalista(await checkIsAnalista());
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAnalista(false);
  };

  return (
    <AuthContext.Provider 
    value={{
        user,
        isAnalista,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};



