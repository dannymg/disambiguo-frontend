'use client'

import { ReactNode, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { 
  Home, 
  FolderOpen, 
  Description, 
  BugReport,
  Settings,
  Logout
} from '@mui/icons-material';
import { Sidebar } from '@/components/common/Sidebar';
import { useAuth } from '@/services/auth/auth-context';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    {
      title: 'Principal',
      items: [
        {
          icon: <Home />,
          title: 'Dashboard',
          path: '/dashboard',
        },
      ],
    },
    {
      title: 'Proyectos',
      items: [
        {
          icon: <FolderOpen />,
          title: 'Mis Proyectos',
          path: '/proyectos',
        },
        {
          icon: <Description />,
          title: 'Requisitos',
          path: '/requisitos',
        },
        {
          icon: <BugReport />,
          title: 'Ambigüedades',
          path: '/ambiguedades',
        },
      ],
    },
    {
      title: 'Configuración',
      items: [
        {
          icon: <Settings />,
          title: 'Ajustes',
          path: '/ajustes',
        },
        {
          icon: <Logout />,
          title: 'Cerrar Sesión',
          onClick: () => {
            logout();
            router.push('/login');
          },
        },
      ],
    },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        items={menuItems}
        open={open}
        onClose={() => setOpen(false)}
        onToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? 240 : theme.spacing(7)})` },
          ml: { sm: open ? 240 : theme.spacing(7) },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box sx={{ height: theme.spacing(8) }} />
        {children}
      </Box>
    </Box>
  );
}

