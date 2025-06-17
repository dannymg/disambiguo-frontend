// Navbar.tsx modularizado con Brand y UserMenu
'use client';

import { AppBar, Toolbar, Box } from '@mui/material';
import ToggleThemeButton from '@/components/common/Navbar/NavbarToggleThemeButton';
import { NavbarLogo } from '@/components/common/Navbar/NavbarLogo';
import { NavbarUserMenu } from '@/components/common/Navbar/NavbarUserMenu';

export default function Navbar() {
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(to right, #0E64C7, #004BB5)',
        }}
      >
        <Toolbar>
          <NavbarLogo />

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          <ToggleThemeButton />
          <NavbarUserMenu />
        </Toolbar>
      </AppBar>

      {/* Espacio reservado para que el contenido no quede oculto */}
      <Toolbar />
    </>
  );
}
