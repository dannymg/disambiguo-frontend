'use client';

import { Button, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="my-4">
        <Link href="/otra-pagina" passHref>
          <Button variant="contained" color="primary">
            Ir a otra página
          </Button>
        </Link>
      </div>

      <div className="my-4">
        <Button
          variant="contained"
          color="success"
          onClick={handleClick}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          Menú desplegable
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>Acción 1</MenuItem>
          <MenuItem onClick={handleClose}>Acción 2</MenuItem>
          <MenuItem onClick={handleClose}>Acción 3</MenuItem>
        </Menu>
      </div>
    </>
  );
}