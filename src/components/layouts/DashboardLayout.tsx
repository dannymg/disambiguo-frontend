"use client";

import { type ReactNode } from "react";
import { Box } from "@mui/material";
import Navbar from "@/components/common/Navbar/Navbar";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import RequireAuth from "@/components/common/Auth/RequireAuth";
import { usePersistentSidebarState } from "@/hooks/general";

const DRAWER_WIDTH = 275;
const COLLAPSED_WIDTH = 65;

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen] = usePersistentSidebarState();

  return (
    <RequireAuth>
      <Box sx={{ display: "flex", bgcolor: "background.default" }}>
        <Sidebar />

        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.appBar,
          }}>
          <Navbar />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            left: sidebarOpen ? `${DRAWER_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
            pt: "80px",
            bgcolor: "background.default",
            minHeight: "100vh",
          }}>
          <Box
            component="main"
            sx={{
              px: { xs: 2, sm: 3, md: 5 },
              pb: 5,
              bgcolor: "background.default",
              transition: (theme) =>
                theme.transitions.create(["padding"], {
                  duration: theme.transitions.duration.shorter,
                }),
            }}>
            {children}
          </Box>
        </Box>
      </Box>
    </RequireAuth>
  );
}
