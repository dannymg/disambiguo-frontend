'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import theme from '@/styles/theme/theme';
import '../styles/globals.css'; // Archivo para animaciones y estilos globales

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="fade-in">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

