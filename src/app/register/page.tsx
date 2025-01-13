'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material'
import { register } from '@/services/auth/auth-service'
// import { useAuth } from '@/services/auth/auth-context'
import { MuiWrapper } from '@/components/MuiWrapper'
import Navbar from '@/components/common/Navbar'; // Importa el Navbar
import Footer from '@/components/common/Footer'; // Importa el Footer

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
   const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const data = await register(username, email, password)
      console.log('Registration successful:', data)
    //   setUser(data.user)
      router.push('/')
    } catch (error) {
      console.error('Registration failed:', error)
      setError('Registro fallido. Por favor, intenta de nuevo.')
    }
  }

  return (
    <MuiWrapper>
    {/* Navbar */}
    <Navbar />
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Crear una cuenta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre"
            name="username"
            autoComplete="username"
            autoFocus
            value={name}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login">
              <Typography variant="body2" color="primary">
                ¿Ya tienes cuenta? Inicia sesión
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
    {/* Footer */}
    <Footer />
    </MuiWrapper>
  )
}

