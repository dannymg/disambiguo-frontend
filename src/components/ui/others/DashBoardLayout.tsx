"use client"

import { type ReactNode, useState } from "react"
import { Box } from "@mui/material"
import Navbar from "@/components/common/Navbar"
import { Sidebar } from "@/components/common/Sidebar"
import { MuiWrapper } from "@/components/MuiWrapper"

const DRAWER_WIDTH = 240
const COLLAPSED_WIDTH = 65

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <MuiWrapper>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Navbar />
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)`,
            marginLeft: `${sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px`,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            mt: 8, // Space for navbar
          }}
        >
          {children}
        </Box>
      </Box>
    </MuiWrapper>
  )
}