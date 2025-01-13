'use client'

import { useState } from 'react';
import { 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  Collapse,
  Box,
  styled,
  useTheme
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface SidebarItemProps {
  icon?: React.ReactNode;
  title: string;
  path?: string;
  onClick?: () => void;
  items?: SidebarItemProps[];
}

interface SidebarProps {
  items: SidebarItemProps[];
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function Sidebar({ items, open, onClose, onToggle }: SidebarProps) {
  const theme = useTheme();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const handleSubMenuClick = (title: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const renderSidebarItem = (item: SidebarItemProps, depth = 0) => {
    const hasSubItems = item.items && item.items.length > 0;
    const isSubMenuOpen = openSubMenus[item.title] || false;

    return (
      <Box key={item.title}>
        <ListItem 
          disablePadding 
          sx={{ display: 'block' }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              pl: depth * 4 + 2,
            }}
            onClick={() => {
              if (hasSubItems) {
                handleSubMenuClick(item.title);
              } else if (item.onClick) {
                item.onClick();
              }
            }}
            href={item.path}
            component={item.path ? 'a' : 'button'}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText 
              primary={item.title} 
              sx={{ 
                opacity: open ? 1 : 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }} 
            />
            {hasSubItems && open && (
              isSubMenuOpen ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        {hasSubItems && (
          <Collapse in={open && isSubMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.items.map(subItem => renderSidebarItem(subItem, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      onClose={onClose}
      sx={{
        width: open ? DRAWER_WIDTH : theme.spacing(7),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : theme.spacing(7),
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={onToggle}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <List>
        {items.map(item => renderSidebarItem(item))}
      </List>
    </Drawer>
  );
}
