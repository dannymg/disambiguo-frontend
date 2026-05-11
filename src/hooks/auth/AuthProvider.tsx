"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCurrentUser, login, logout, register, checkIsAnalista, persistUser } from "./auth";
import { User } from "@/types";

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

  const setAuthenticatedUser = async (currentUser: User) => {
    persistUser(currentUser);
    setUser(currentUser);
    setIsAnalista(checkIsAnalista(currentUser));
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAnalista(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      const jwt = localStorage.getItem("jwt");

      if (jwt) {
        try {
          const currentUser = await getCurrentUser();
          await setAuthenticatedUser(currentUser);
        } catch (error) {
          console.error("Error al inicializar la autenticación:", error);
          handleLogout();
        }
      }

      setIsLoading(false);
    };

    const handleSessionExpired = () => {
      setUser(null);
      setIsAnalista(false);
      setIsLoading(false);
    };

    initializeAuth();
    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      const currentUser = await getCurrentUser();
      await setAuthenticatedUser(currentUser);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await register(username, email, password);
      const currentUser = await getCurrentUser();
      await setAuthenticatedUser(currentUser);
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
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
