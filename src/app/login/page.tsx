'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '@/hooks/auth/auth-context';
import { MuiWrapper } from '@/components/MuiWrapper';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/proyectos');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Inicio de sesión fallido. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <MuiWrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Contenido principal */}
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5" color="text.primary">
                Iniciar sesión
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Iniciar sesión
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Link href="/register">
                    <Typography variant="body2" color="primary">
                      ¿No tienes cuenta? Regístrate
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </MuiWrapper>
  );
}