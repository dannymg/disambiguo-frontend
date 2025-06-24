import { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Avatar, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/AuthProvider";

export function NavbarUserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    router.push("/login");
  };

  if (user) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ mr: 2 }}>Bienvenido, {user.username}</Typography>
        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
          <Avatar>{user.username[0].toUpperCase()}</Avatar>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorEl)}
          onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleClose();
              router.push("/perfil");
            }}>
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button color="inherit" variant="outlined" onClick={() => router.push("/login")}>
        Ingresar
      </Button>
      <Button variant="contained" color="secondary" onClick={() => router.push("/register")}>
        Registrarse
      </Button>
    </Box>
  );
}
