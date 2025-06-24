"use client";

import { Box, Container } from "@mui/material";
import PublicLayout from "@/components/layouts/PublicLayout";
import RegisterForm from "@/components/appComponents/register/RegisterForm";

export default function Register() {
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
        <Container component="main" maxWidth="xs">
          <RegisterForm />
        </Container>
      </Box>
    </PublicLayout>
  );
}
