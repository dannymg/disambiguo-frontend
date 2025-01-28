"use client"

import { useState } from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  Box,
  Tooltip,
  Divider,
} from "@mui/material"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  FolderOpen,
  Description,
  BugReport,
  Assessment,
  ExpandLess,
  ExpandMore,
  Upload,
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
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    proyectos: true,
    ambiguedad: true,
    reportes: true,
  })

  const handleMenuClick = (menuKey: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }

  const menuItems = [
    {
      key: "inicio",
      title: "Inicio",
      icon: <Home />,
      path: "/dashboard",
    },
    {
      key: "proyectos",
      title: "Proyectos",
      icon: <FolderOpen />,
      submenu: [
        {
          title: "Mis Proyectos",
          path: "/proyectos",
          icon: <FolderOpen />,
        },
        {
          title: "Administrar Requisitos",
          path: "/requisitos",
          icon: <Description />,
        },
        {
          title: "Cargar CSV",
          path: "/cargar-csv",
          icon: <Upload />,
        },
      ],
    },
    {
      key: "ambiguedad",
      title: "Analizar Ambigüedad",
      icon: <BugReport />,
      submenu: [
        {
          title: "Generar Correcciones",
          path: "/generar-correcciones",
          icon: <BugReport />,
        },
        {
          title: "Validar Correcciones",
          path: "/validar-correcciones",
          icon: <Description />,
        },
      ],
    },
    {
      key: "reportes",
      title: "Reportes",
      icon: <Assessment />,
      submenu: [
        {
          title: "Exportar Requisitos",
          path: "/exportar-requisitos",
          icon: <Description />,
        },
        {
          title: "Exportar Análisis",
          path: "/exportar-analisis",
          icon: <Assessment />,
        },
      ],
    },
  ]

  const isActive = (path: string) => pathname === path

  return (
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
          <Box key={item.key}>
            {item.submenu ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuClick(item.key)}
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
                    {open && (
                      <>
                        <ListItemText primary={item.title} />
                        {openMenus[item.key] ? <ExpandLess /> : <ExpandMore />}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={open && openMenus[item.key]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem) => (
                      <ListItem key={subItem.path} disablePadding>
                        <ListItemButton
                          sx={{ pl: 4 }}
                          onClick={() => router.push(subItem.path)}
                          selected={isActive(subItem.path)}
                        >
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.title} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
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
            )}
          </Box>
        ))}
      </List>
    </Drawer>
  )
}