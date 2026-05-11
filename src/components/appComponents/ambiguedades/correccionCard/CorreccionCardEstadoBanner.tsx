"use client";

import { Typography, useTheme } from "@mui/material";

interface Props {
  texto: string;
  estadoLocal: "ACEPTADO" | "RECHAZADO" | "MODIFICADO" | null | undefined;
}

export default function CorreccionCardEstadoBanner({ texto, estadoLocal }: Props) {
  const theme = useTheme();

  return (
    <Typography
      mt={2}
      fontWeight="bold"
      color={
        estadoLocal === "RECHAZADO"
          ? theme.palette.error.main
          : estadoLocal === "ACEPTADO"
            ? theme.palette.success.main
            : estadoLocal === "MODIFICADO"
              ? theme.palette.warning.main
              : theme.palette.text.secondary
      }>
      {texto}
    </Typography>
  );
}
