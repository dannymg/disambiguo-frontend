"use client";

import { Box, Tooltip, useTheme } from "@mui/material";

interface Props {
  estadoLocal: "VALIDADO" | "NO_VALIDADO" | null;
  visible: boolean;
}

export default function ValidarCardStatusDot({ estadoLocal, visible }: Props) {
  const theme = useTheme();
  if (!visible) return null;

  return (
    <Tooltip title={estadoLocal || "Sin decidir"}>
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor:
            estadoLocal === "VALIDADO"
              ? theme.palette.success.main
              : estadoLocal === "NO_VALIDADO"
                ? theme.palette.error.main
                : theme.palette.grey[400],
        }}
      />
    </Tooltip>
  );
}
