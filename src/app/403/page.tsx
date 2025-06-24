"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
      <Box>
        <Typography variant="h1" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h5" gutterBottom>
          No tienes permiso para acceder a esta página.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push("/")} sx={{ mt: 3 }}>
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
}
