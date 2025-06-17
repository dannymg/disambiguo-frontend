// Hook para manejar estado persistente del sidebar
import { useEffect, useState } from 'react';

export function usePersistentSidebarState(): [boolean, () => void] {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setOpen(saved === 'true');
    }
  }, []);

  const toggle = () => {
    const newState = !open;
    setOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
  };

  return [open, toggle];
}
