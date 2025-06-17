'use client';

import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(90deg,rgb(0, 0, 0),rgb(21, 22, 26))',
        color: '#fff',
        padding: 4,
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        © 2025 DisAmbiguo. Universidad Nacional de Loja.
      </Typography>
      <Typography variant="body2">
        Desarrollado por{' '}
        <Link
          href="https://github.com/dannymg"
          color="inherit"
          underline="hover"
          sx={{ fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}
        >
          Danny Martinez
        </Link>
      </Typography>
    </Box>
  );
}