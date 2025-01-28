// Archivo para envolver los componentes de Material-UI y solo renderizarlos en el cliente
// Esto evita errores de Material-UI al renderizar componentes en el servidor

'use client'; 

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress} from '@mui/material';
import theme from "@/styles/theme/theme";

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(to right, #ECE9E6, #FFFFFF)",
        }}
      >
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    )
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


