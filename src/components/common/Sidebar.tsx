"use client"

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Box,
  Tooltip,
  Divider,
  Backdrop,
} from "@mui/material"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  FolderOpen,
  BugReport,
  Assessment,
} from "@mui/icons-material"
import { useRouter, usePathname } from "next/navigation"

const DRAWER_WIDTH = 260
const COLLAPSED_WIDTH = 65

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      key: "inicio",
      title: "Inicio",
      icon: <Home />,
      path: "/proyectos",
    },
    {
      key: "proyectos",
      title: "Proyectos",
      icon: <FolderOpen />,
      path: "/proyectos",
    },
    {
      key: "ambiguedad",
      title: "Ambigüedad",
      icon: <BugReport />,
      path: "/ambiguedades",
    },
    {
      key: "reportes",
      title: "Reportes",
      icon: <Assessment />,
      path: "/reportes",
    },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Overlay backdrop */}
      {open && (
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer - 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          open={open}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
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
            zIndex: (theme) => theme.zIndex.drawer,
          },
        }}
      >
        <Box sx={{ height: 64 }} /> {/* Spacer for AppBar */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={onToggle}>{open ? <ChevronLeft /> : <ChevronRight />}</IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                onClick={() => router.push(item.path)}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <Tooltip title={!open ? item.title : ""} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>
                {open && <ListItemText primary={item.title} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}