"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Typography, TextField, Button, Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/hooks/auth/AuthProvider";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let valid = true;

    if (!username) {
      setUsernameError("El nombre de usuario es obligatorio.");
      valid = false;
    } else if (username.length < 3 || username.length > 40) {
      setUsernameError("Debe tener entre 3 y 40 caracteres.");
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!email) {
      setEmailError("El correo electrónico es obligatorio.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Formato de correo inválido.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria.");
      valid = false;
    } else if (password.length < 4 || password.length > 20) {
      setPasswordError("Debe tener entre 4 y 20 caracteres.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(username, email, password);
      router.push("/proyectos");
    } catch (error) {
      console.error("Registration failed:", error);
      setEmailError(
        error instanceof Error
          ? error.message
          : "Error en el registro. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography component="h1" variant="h5" color="text.primary">
        Crear una cuenta
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Nombre de usuario"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!usernameError}
          helperText={usernameError}
          disabled={isSubmitting}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo electrónico"
          name="email"
          autoComplete="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          disabled={isSubmitting}
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
          error={!!passwordError}
          helperText={passwordError}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Registrarse"}
        </Button>
        <Box sx={{ textAlign: "center" }}>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <Typography variant="body2" color="primary">
              ¿Ya tienes cuenta? Inicia sesión
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
