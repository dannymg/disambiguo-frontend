// src/tests/utils/AppTestWrapper.tsx
import { ReactNode } from "react";
import { EmotionCacheProvider } from "@/styles/emotionCache";
import { ThemeModeProvider } from "@/styles/theme/ThemeContext";
import { AppThemeProvider } from "@/styles/theme/ThemeProvider";
import { AppAuthProvider } from "@/hooks/auth/AuthProvider";

export function AppTestWrapper({ children }: { children: ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ThemeModeProvider>
        <AppThemeProvider>
          <AppAuthProvider>{children}</AppAuthProvider>
        </AppThemeProvider>
      </ThemeModeProvider>
    </EmotionCacheProvider>
  );
}
