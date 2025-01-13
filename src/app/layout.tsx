'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import theme from '@/styles/theme/theme';
import { AuthProvider } from '@/services/auth/auth-context';
import '../styles/globals.css'; // Archivo para animaciones y estilos globales

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
      <ThemeProvider theme={theme}>
          <AuthProvider>
              <CssBaseline />
              <div className="fade-in">
                  {children}
              </div>
          </AuthProvider>
        </ThemeProvider> 
      </body>
    </html>
  );
}

