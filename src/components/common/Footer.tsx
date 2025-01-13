'use client';

import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, #1a237e, #3f51b5)', // Degradado para armonizar con el Navbar
        color: '#fff',
        padding: 4,
        textAlign: 'center',
        marginTop: 'auto', // Esto asegura que se quede en la parte inferior
      }}
    >
      <Typography variant="body2" sx={{ marginBottom: 1, fontWeight: '500' }}>
        © 2025 DisAmbiguo. Todos los derechos reservados.
      </Typography>
      <Typography variant="body2">
        Desarrollado por{' '}
        <Link
          href="https://github.com/dannymg"
          color="inherit"
          underline="hover"
          sx={{
            fontWeight: 'bold',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Danny Martinez
        </Link>
      </Typography>
    </Box>
  );
}
