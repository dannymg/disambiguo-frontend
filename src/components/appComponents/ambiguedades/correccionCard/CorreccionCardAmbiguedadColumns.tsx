"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface Props {
  tipoAmbiguedad: string;
  explicacionAmbiguedad: string;
}

export default function CorreccionCardAmbiguedadColumns({
  tipoAmbiguedad,
  explicacionAmbiguedad,
}: Props) {
  const theme = useTheme();
  const panelSx = {
    p: 2,
    borderRadius: 2,
    bgcolor: alpha(theme.palette.background.paper, 0.6),
  };

  return (
    <Box sx={{ display: "flex", gap: 4, my: 2 }}>
      <Box sx={{ ...panelSx, width: "30%" }}>
        <Typography variant="subtitle2">Tipo de ambigüedad</Typography>
        <Typography>{tipoAmbiguedad || "—"}</Typography>
      </Box>
      <Box sx={{ ...panelSx, width: "70%" }}>
        <Typography variant="subtitle2">Explicación</Typography>
        <Typography>{explicacionAmbiguedad || "—"}</Typography>
      </Box>
    </Box>
  );
}
