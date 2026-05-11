"use client";

import { Box, Container } from "@mui/material";
import PublicLayout from "@/components/layouts/PublicLayout";
import RegisterForm from "@/components/appComponents/register/RegisterForm";
import { useRedirectIfAuthenticated } from "@/hooks/general";

export default function Register() {
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
          px: 2,
          py: { xs: 6, md: 10 },
        }}>
        <Container component="main" maxWidth="xs">
          <RegisterForm />
        </Container>
      </Box>
    </PublicLayout>
  );
}
