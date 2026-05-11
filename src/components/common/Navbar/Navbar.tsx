"use client";

import { AppBar, Toolbar, Box } from "@mui/material";
import ToggleThemeButton from "@/components/common/Navbar/NavbarToggleThemeButton";
import { NavbarLogo } from "@/components/common/Navbar/NavbarLogo";
import { NavbarUserMenu } from "@/components/common/Navbar/NavbarUserMenu";

export default function Navbar() {
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #2563eb, #7c3aed)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>
        <Toolbar>
          <NavbarLogo />

          <Box sx={{ flexGrow: 1 }} />

          <ToggleThemeButton />
          <NavbarUserMenu />
        </Toolbar>
      </AppBar>

      {/* Espaciador */}
      <Toolbar />
    </>
  );
}
