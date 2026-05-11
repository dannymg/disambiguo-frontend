import { alpha, Theme } from "@mui/material/styles";

export function estadoContenedorCorreccion(
  theme: Theme,
  estadoLocal: "ACEPTADO" | "RECHAZADO" | "MODIFICADO" | null | undefined,
  esVacio: boolean
) {
  return esVacio
    ? {
        border: `1px dashed ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.default, 0.4),
      }
    : estadoLocal === "ACEPTADO"
      ? {
          border: `2px solid ${theme.palette.success.main}`,
          backgroundColor: alpha(theme.palette.success.light, 0.25),
        }
      : estadoLocal === "RECHAZADO"
        ? {
            border: `2px dashed ${theme.palette.error.main}`,
            backgroundColor: alpha(theme.palette.error.light, 0.2),
          }
        : estadoLocal === "MODIFICADO"
          ? {
              border: `2px solid ${theme.palette.warning.main}`,
              backgroundColor: alpha(theme.palette.warning.light, 0.2),
            }
          : {
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.default, 0.7),
            };
}

export function etiquetaEstadoTexto(
  estadoLocal: "ACEPTADO" | "RECHAZADO" | "MODIFICADO" | null | undefined,
  esVacio: boolean
): string | null {
  if (estadoLocal === "ACEPTADO") return "✅ Requisito marcado como ACEPTADO";
  if (estadoLocal === "RECHAZADO") return "❌ Requisito marcado como RECHAZADO";
  if (estadoLocal === "MODIFICADO") return "✏️ Requisito MODIFICADO manualmente";
  if (esVacio) return "No se pudo detectó ambigüedad con el análisis automático.";
  return null;
}
