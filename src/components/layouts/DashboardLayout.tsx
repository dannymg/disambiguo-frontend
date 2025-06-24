"use client";

import { type ReactNode } from "react";
import { Box } from "@mui/material";
import Navbar from "@/components/common/Navbar/Navbar";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import { usePersistentSidebarState } from "@/hooks/general/usePersistentSidebarState";

const DRAWER_WIDTH = 275;
const COLLAPSED_WIDTH = 65;

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen] = usePersistentSidebarState();

  return (
    <Box sx={{ display: "flex", bgcolor: (theme) => theme.palette.background.default }}>
      {/* Sidebar Fijo */}
      <Sidebar />

      {/* Navbar está FUERA y posicionado con fixed */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
        }}>
        <Navbar />
      </Box>

      {/* Contenedor para lo que sí debe desplazarse */}
      <Box
        sx={{
          flexGrow: 1,
          left: sidebarOpen ? `${DRAWER_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
          pt: "80px", // espacio suficiente para no chocar con el Navbar
          bgcolor: (theme) => theme.palette.background.default,
          minHeight: "100vh",
        }}>
        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            px: 10,
            bgcolor: (theme) => theme.palette.background.default,
          }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
