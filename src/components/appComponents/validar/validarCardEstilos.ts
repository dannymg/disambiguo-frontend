import { alpha, Theme } from "@mui/material/styles";

export function estadoContenedorValidacion(
  theme: Theme,
  estadoLocal: "VALIDADO" | "NO_VALIDADO" | null
) {
  if (estadoLocal === "VALIDADO") {
    return {
      border: `2px solid ${theme.palette.success.main}`,
      backgroundColor: alpha(theme.palette.success.light, 0.15),
    };
  }

  if (estadoLocal === "NO_VALIDADO") {
    return {
      border: `2px dashed ${theme.palette.error.main}`,
      backgroundColor: alpha(theme.palette.error.light, 0.15),
    };
  }

  return {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: alpha(theme.palette.background.default, 0.6),
  };
}

export function etiquetaValidacion(estadoLocal: "VALIDADO" | "NO_VALIDADO" | null): string | null {
  if (estadoLocal === "VALIDADO") return "✅ Requisito validado";
  if (estadoLocal === "NO_VALIDADO") return "❌ Requisito rechazado";
  return null;
}
