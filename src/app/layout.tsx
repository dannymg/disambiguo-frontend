'use client';

import { ReactNode } from 'react';
import { EmotionCacheProvider } from '@/styles/emotionCache';
import { ThemeModeProvider } from '@/styles/theme/ThemeContext';
import { AppThemeProvider } from '@/styles/theme/ThemeProvider';  
import { AppAuthProvider } from '@/hooks/auth/AuthProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <EmotionCacheProvider>
          <ThemeModeProvider>
            <AppThemeProvider>
              <AppAuthProvider>
                {children}
              </AppAuthProvider>
            </AppThemeProvider>
          </ThemeModeProvider>
        </EmotionCacheProvider>
      </body>
    </html>
  );
}