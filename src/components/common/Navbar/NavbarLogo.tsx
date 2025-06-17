'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/AuthProvider';

export function NavbarLogo() {
  const router = useRouter();
  const { user } = useAuth();

  const handleRedirect = () => {
    router.push(user ? '/proyectos' : '/');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
      <Image
        src="/placeholder.svg"
        alt="Logo"
        width={40}
        height={40}
        onClick={handleRedirect}
        style={{ cursor: 'pointer' }}
      />
      <Typography
        onClick={handleRedirect}
        variant="h6"
        component="div"
        sx={{ ml: 1, fontWeight: 'bold', display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
      >
        DisAmbiguo
      </Typography>
    </Box>
  );
}
