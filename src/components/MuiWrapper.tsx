// MuiWrapper.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@/styles/theme/ThemeContext';

export const MuiWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  // Cambiar el estado cuando el componente se monte en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(to right, #ECE9E6, #FFFFFF)',
        }}
      >
        <CircularProgress sx={{ color: '#0E64C7' }} />
      </Box>
    );
  }

  return (
    <ThemeProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Asegura que la altura mínima sea el 100% de la pantalla
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};