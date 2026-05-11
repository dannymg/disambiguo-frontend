import { useState } from "react";
import type { MouseEvent } from "react";
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";

export function NavbarUserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.85)",
            display: { xs: "none", md: "block" },
          }}>
          Hola, <strong>{user.username}</strong>
        </Typography>

        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
          <Avatar
            sx={{
              bgcolor: "white",
              color: "primary.main",
              width: 36,
              height: 36,
              fontSize: 14,
              fontWeight: 600,
            }}>
            {user.username[0].toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem disabled>{user.email}</MenuItem>
          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
      <Button
        variant="text"
        onClick={() => router.push("/login")}
        sx={{
          color: "white",
          opacity: 0.9,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        }}>
        Ingresar
      </Button>

      <Button
        variant="contained"
        onClick={() => router.push("/register")}
        sx={{
          backgroundColor: "white",
          color: "primary.main",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#f1f5f9",
          },
        }}>
        Registrarse
      </Button>
    </Box>
  );
}
