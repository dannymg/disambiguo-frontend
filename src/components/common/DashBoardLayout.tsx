"use client"
import { type ReactNode, useState } from "react"
import { Box } from "@mui/material"
import Navbar from "@/components/common/Navbar"
import { Sidebar } from "@/components/common/Sidebar"
import { MuiWrapper } from "@/components/MuiWrapper"

const COLLAPSED_WIDTH = 65

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Estado inicial comprimido

  return (
    <MuiWrapper>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Navbar */}
        <Navbar />

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${COLLAPSED_WIDTH}px)`, // Siempre usa el ancho colapsado
            marginLeft: `${COLLAPSED_WIDTH}px`, // Margen fijo basado en el estado colapsado
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            mt: 8, // Espacio para el navbar
            bgcolor: (theme) => theme.palette.background.default,
          }}
        >
          {children}
        </Box>
      </Box>
    </MuiWrapper>
  )
}