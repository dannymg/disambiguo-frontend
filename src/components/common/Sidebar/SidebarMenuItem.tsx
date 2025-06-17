import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function SidebarMenuItem({
  icon,
  label,
  path,
  open,
}: {
  icon: ReactNode;
  label: string;
  path: string;
  open: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <Tooltip title={!open ? label : ''} placement="right" arrow>
        <ListItemButton
          onClick={() => router.push(path)}
          selected={isActive}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            '&:hover': {
              bgcolor: (theme) => theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {icon}
          </ListItemIcon>
          {open && <ListItemText primary={label} />}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}
