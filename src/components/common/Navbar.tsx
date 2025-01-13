'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #3f51b5, #1a237e)', // Degradado en lugar de color sólido
        color: '#fff',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 2 }}>
        {/* Título */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          DisAmbiguo
        </Typography>

        {/* Menú */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button color="inherit" href="/about" sx={{ fontWeight: '500' }}>
            Sobre Nosotros
          </Button>
          <Button color="inherit" href="/features" sx={{ fontWeight: '500' }}>
            Características
          </Button>
          <Button color="inherit" href="/contact" sx={{ fontWeight: '500' }}>
            Contacto
          </Button>
        </Box>

        {/* Botones */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            href="/login"
            sx={{
              borderColor: '#fff',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            Ingresar
          </Button>
          <Button
            variant="contained"
            href="/register"
            sx={{
              background: '#f50057',
              '&:hover': { backgroundColor: '#c51162' },
            }}
          >
            Registrarse
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
