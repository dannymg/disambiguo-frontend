"use client";

import { Container, Typography, Button, Box, Card, CardContent, Stack } from "@mui/material";
import PublicLayout from "@/components/layouts/PublicLayout";
import { useRedirectIfAuthenticated } from "@/hooks/general";

export default function HomePage() {
  useRedirectIfAuthenticated();

  return (
    <PublicLayout>
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: 2,
        }}>
        <Container maxWidth="md">
          {/* HERO */}
          <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: { xs: 8, md: 12 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: {
                  xs: "2rem",
                  sm: "2.6rem",
                  md: "3.2rem",
                },
              }}>
              Detección de Ambigüedades en Requisitos
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontSize: {
                  xs: "1rem",
                  md: "1.1rem",
                },
              }}>
              Analiza automáticamente tus requisitos, identifica ambigüedades y mejora la claridad
              de tus especificaciones.
            </Typography>

            {/* 🔥 BOTONES MEJORADOS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 2,
                flexWrap: "wrap",
              }}>
              <Button
                variant="contained"
                size="large"
                href="/login"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 3,
                  fontWeight: 600,
                  boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
                }}>
                Ingresar
              </Button>

              <Button
                variant="outlined"
                size="large"
                href="/register"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 3,
                  fontWeight: 500,
                }}>
                Registrarse
              </Button>
            </Box>
          </Stack>

          {/* FEATURES */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" textAlign="center" sx={{ fontWeight: 600, mb: 5 }}>
              Características principales
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 4,
              }}>
              {/* CARD 1 */}
              <Card
                sx={{
                  p: 2,
                  borderRadius: 4,
                  boxShadow: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Detección automática
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Identifica ambigüedades en los requisitos utilizando procesamiento de lenguaje
                    natural.
                  </Typography>
                </CardContent>
              </Card>

              {/* CARD 2 */}
              <Card
                sx={{
                  p: 2,
                  borderRadius: 4,
                  boxShadow: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Validación de requisitos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mejora la calidad eliminando términos vagos y asegurando precisión en las
                    especificaciones.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
}
