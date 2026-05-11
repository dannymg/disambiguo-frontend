"use client";

import { Box, Tooltip, useTheme } from "@mui/material";

interface Props {
  estadoLocal: "ACEPTADO" | "RECHAZADO" | "MODIFICADO" | null | undefined;
  esVacio: boolean;
  visible: boolean;
}

export default function CorreccionCardStatusDot({ estadoLocal, esVacio, visible }: Props) {
  const theme = useTheme();
  if (!visible) return null;

  return (
    <Tooltip title={estadoLocal || "VACIO"} placement="top">
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: esVacio
            ? theme.palette.grey[500]
            : estadoLocal === "ACEPTADO"
              ? theme.palette.success.main
              : estadoLocal === "RECHAZADO"
                ? theme.palette.error.main
                : theme.palette.warning.main,
          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        }}
      />
    </Tooltip>
  );
}
