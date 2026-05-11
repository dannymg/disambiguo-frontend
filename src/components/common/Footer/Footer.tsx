"use client";

import { Box, Link, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: "center",
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}>
      <Typography variant="body2" color="text.secondary">
        © 2025 DisAmbiguo. Universidad Nacional de Loja.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Desarrollado por{" "}
        <Link href="https://github.com/dannymg" color="inherit" underline="hover" fontWeight={700}>
          Danny Martinez
        </Link>
      </Typography>
    </Box>
  );
}
