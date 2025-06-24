"use client";

import { Drawer, List, Box, Divider } from "@mui/material";
import { FolderOpen, BugReport, Assessment } from "@mui/icons-material";
import { SidebarToggle } from "./SidebarToggle";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { usePersistentSidebarState } from "@/hooks/general/usePersistentSidebarState";

const DRAWER_WIDTH = 275;
const COLLAPSED_WIDTH = 65;

export function Sidebar() {
  const [open, toggleOpen] = usePersistentSidebarState();

  const menuItems = [
    { label: "Mis proyectos", icon: <FolderOpen />, path: "/proyectos" },
    { label: "Análisis de ambigüedades", icon: <BugReport />, path: "/ambiguedades" },
    { label: "Generar reportes", icon: <Assessment />, path: "/reportes" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          boxSizing: "border-box", // ← Asegura que width sea interpretado correctamente
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: "hidden",
          backgroundColor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          position: "fixed",
          zIndex: (theme) => theme.zIndex.appBar - 1,
        },
      }}
      PaperProps={{
        sx: {
          pointerEvents: "auto", // ← opcional, por si necesitas que Sidebar no bloquee clics
        },
      }}>
      <Box sx={{ height: 64, bgcolor: (theme) => theme.palette.background.default }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <SidebarToggle open={open} onToggle={toggleOpen} />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            open={open}
          />
        ))}
      </List>
    </Drawer>
  );
}
