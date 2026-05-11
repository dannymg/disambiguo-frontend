"use client";

import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";

export default function ReportesPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PageHeader
          title="Generar reportes"
          subtitle="Este módulo estará disponible para consolidar resultados de análisis y correcciones por proyecto."
        />

        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}>
          <Stack spacing={2.5} alignItems="center">
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: (theme) => theme.palette.action.hover,
                color: "primary.main",
              }}>
              <AssessmentIcon fontSize="large" />
            </Box>
            <Typography variant="h5" fontWeight={700}>
              Reportes en preparación
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
              La navegación ya está protegida y lista. Cuando el flujo de reportes se defina, esta
              pantalla puede conectar con los proyectos y resultados almacenados.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/proyectos")}>
              Volver a proyectos
            </Button>
          </Stack>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
