import { IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export function SidebarToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <IconButton onClick={onToggle}>
      {open ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  );
}
