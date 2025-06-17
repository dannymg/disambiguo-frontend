'use client';

import { Box, Container } from '@mui/material';
import PublicLayout from '@/components/layouts/PublicLayout';
import LoginForm from '@/components/app/login/LoginForm';

export default function Login() {
  return (
    <PublicLayout>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
        }}
      >
        <Container component="main" maxWidth="xs">
          <LoginForm />
        </Container>
      </Box>
    </PublicLayout>
  );
}
