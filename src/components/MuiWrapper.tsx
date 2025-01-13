// Archivo para envolver los componentes de Material-UI y solo renderizarlos en el cliente
// Esto evita errores de Material-UI al renderizar componentes en el servidor

'use client'; 

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

export const MuiWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  // Cambiar el estado cuando el componente se monte en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Asegura que la altura mínima sea el 100% de la pantalla
      }}
    >
      {children}
    </Box>
  );
};


