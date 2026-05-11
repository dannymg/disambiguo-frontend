"use client";

import { Box, Container } from "@mui/material";
import PublicLayout from "@/components/layouts/PublicLayout";
import LoginForm from "@/components/appComponents/login/LoginForm";
import { useRedirectIfAuthenticated } from "@/hooks/general";

export default function Login() {
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
          <LoginForm />
        </Container>
      </Box>
    </PublicLayout>
  );
}
