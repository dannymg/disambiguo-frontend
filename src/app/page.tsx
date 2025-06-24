"use client";

import { Container, Typography, Button, Box, Card, CardContent } from "@mui/material";
import PublicLayout from "@/components/layouts/PublicLayout";
import { useRedirectIfAuthenticated } from "@/hooks/general/useRedirectIfAuthenticated";

export default function HomePage() {
  useRedirectIfAuthenticated();

  return (
    <PublicLayout>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="h1" color="primary" gutterBottom>
            Software para la Detección de Ambigüedades en Requisitos
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Analiza requisitos para identificar ambigüedades y mejora la calidad de tus documentos.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" color="primary" size="large" href="/login">
              Ingresar
            </Button>
            <Button variant="outlined" color="secondary" size="large" href="/register">
              Registrarse
            </Button>
          </Box>
        </Container>

        {/* Sección de características principales */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="h4" color="secondary" gutterBottom>
            Características Principales
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              flexWrap: "wrap",
              mt: 4,
            }}>
            <Card
              sx={{
                maxWidth: 345,
                bgcolor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.primary.contrastText,
              }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detección Automática
                </Typography>
                <Typography>
                  Identifica ambigüedades en los requisitos utilizando técnicas avanzadas de NLP.
                </Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                maxWidth: 345,
                bgcolor: (theme) => theme.palette.secondary.light,
                color: (theme) => theme.palette.secondary.contrastText,
              }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Validación de Requisitos
                </Typography>
                <Typography>
                  Asegura claridad y precisión eliminando términos vagos o ambiguos.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </PublicLayout>
  );
}
