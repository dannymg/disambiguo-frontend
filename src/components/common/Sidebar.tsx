'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Collapse, Box, Typography } from '@mui/material'
import { Menu as MenuIcon, ExpandLess, ExpandMore, Dashboard, Description, Settings, ExitToApp } from '@mui/icons-material'
import { useAuth } from '../../services/auth/auth-context.jsx'

interface MenuItem {
  title: string
  icon: React.ReactNode
  href?: string
  submenu?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <Dashboard />,
    href: '/dashboard'
  },
  {
    title: 'Gestión',
    icon: <Description />,
    submenu: [
      { title: 'Proyectos', href: '/dashboard', icon: <Dashboard /> },
      { title: 'Crear Proyecto', href: '/create-project', icon: <Description /> },
      { title: 'Cargar Requisitos', href: '/cargar-requisitos', icon: <Description /> },
    ]
  },
  {
    title: 'Configuración',
    icon: <Settings />,
    href: '/configuracion'
  }
]

function MenuItem({ item, isOpen, depth = 0 }: { item: MenuItem; isOpen: boolean; depth?: number }) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const pathname = usePathname()
  const isActive = item.href === pathname

  if (item.submenu) {
    return (
      <>
        <ListItem
          button
          onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
          sx={{ pl: 2 * (depth + 1) }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          {isOpen && (
            <>
              <ListItemText primary={item.title} />
              {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItem>
        <Collapse in={isSubmenuOpen && isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.submenu.map((subItem) => (
              <MenuItem key={subItem.title} item={subItem} isOpen={isOpen} depth={depth + 1} />
            ))}
          </List>
        </Collapse>
      </>
    )
  }
  
  return (
    <ListItem
      button
      component={Link}
      href={item.href || '#'}
      selected={isActive}
      sx={{ pl: 2 * (depth + 1) }}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      {isOpen && <ListItemText primary={item.title} />}
    </ListItem>
  )
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const { user, isAnalista, logout } = useAuth()

  const filteredMenuItems = menuItems.map(item => {
    if (item.title === 'Gestión' && !isAnalista) {
      return {
        ...item,
        submenu: item.submenu?.filter(subItem => subItem.title !== 'Crear Proyecto' && subItem.title !== 'Cargar Requisitos')
      }
    }
    return item
  })

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setIsOpen(!isOpen)}
        edge="start"
        sx={{
          position: 'fixed',
          left: isOpen ? 240 : 20,
          top: 20,
          zIndex: 1300,
          transition: 'left 0.3s',
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen ? 240 : 60,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 8 }}>
          <List>
            {filteredMenuItems.map((item) => (
              <MenuItem key={item.title} item={item} isOpen={isOpen} />
            ))}
          </List>
        </Box>
        {user && (
          <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
            <ListItem button onClick={logout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Cerrar sesión" />}
            </ListItem>
          </Box>
        )}
      </Drawer>
    </>
  )
}

