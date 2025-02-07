// Navbar.tsx
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Switch,
} from '@mui/material';
import { useAuth } from '@/hooks/auth/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useThemeContext } from '@/styles/theme/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useThemeContext();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(to right, #0E64C7, #004BB5)',
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Image src="/placeholder.svg" alt="Logo" width={40} height={40}             
          onClick={() => router.push('/')}/>
          <Typography
            onClick={() => router.push('/')}
            variant="h6"
            component="div"
            sx={{ ml: 1, fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}
          >
            DisAmbiguo
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Modo Noche */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Modo Noche
          </Typography>
          <Switch checked={isDarkMode} onChange={toggleTheme} color="secondary" />
        </Box>

        {/* User Menu */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }}>Bienvenido, {user.username}</Typography>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar alt={user.username} src="/placeholder.svg" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push('/perfil');
                }}
              >
                Mi Perfil
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push('/configuracion');
                }}
              >
                Configuración
              </MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" variant="outlined" onClick={() => router.push('/login')}>
              Ingresar
            </Button>
            <Button variant="contained" color="secondary" onClick={() => router.push('/register')}>
              Registrarse
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}