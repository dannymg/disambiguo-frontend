"use client";

import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useRouter } from "next/navigation";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <PublicLayout>
      <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
        <Paper
          sx={{
            p: { xs: 3, sm: 5 },
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
                bgcolor: (theme) => theme.palette.error.main,
                color: "error.contrastText",
              }}>
              <LockOutlinedIcon fontSize="large" />
            </Box>
            <Typography variant="h3" color="error" fontWeight={700}>
              403
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              Acceso restringido
            </Typography>
            <Typography color="text.secondary">
              No tienes permiso para acceder a esta página o realizar esta operación.
            </Typography>
            <Button variant="contained" onClick={() => router.push("/")}>
              Volver al inicio
            </Button>
          </Stack>
        </Paper>
      </Container>
    </PublicLayout>
  );
}
