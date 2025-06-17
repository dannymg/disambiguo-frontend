"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default,
      }}
    >
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>{children}</Box>

      <Footer />
    </Box>
  );
}
