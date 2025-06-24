"use client";

import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { getCurrentUser, login, logout, register, checkIsAnalista } from "./auth";
import { User } from "@/types/entities";

interface AuthContextType {
  user: User | null;
  isAnalista: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AppAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAnalista, setIsAnalista] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      const jwt = localStorage.getItem("jwt");
      const storedUser = localStorage.getItem("user");

      if (jwt && storedUser) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          const analistaCheck = await checkIsAnalista();
          setIsAnalista(analistaCheck);
        } catch (error) {
          console.error("Error al inicializar la autenticación:", error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      setUser(data.user);
      setIsAnalista(await checkIsAnalista());
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const data = await register(username, email, password);
      setUser(data.user);
      setIsAnalista(await checkIsAnalista());
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
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
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
