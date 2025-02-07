// layout.tsx
'use client';
import { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/auth/auth-context';
import { MuiWrapper } from '@/components/MuiWrapper';
import '../styles/globals.css'; // Archivo para animaciones y estilos globales

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <MuiWrapper>
          <AuthProvider>
            <div className="fade-in">{children}</div>
          </AuthProvider>
        </MuiWrapper>
      </body>
    </html>
  );
}