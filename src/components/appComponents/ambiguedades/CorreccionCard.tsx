"use client";

import { Paper, Typography, Box, TextField, Button, Stack, useTheme, Tooltip } from "@mui/material";
import { useState } from "react";
import { alpha } from "@mui/material/styles";

interface Props {
  documentId: string;
  identificador: string;
  tipoAmbiguedad: string;
  explicacionAmbiguedad: string;
  descripcionGenerada: string;
  nombreRequisito: string;
  descripcionOriginal: string;
  comentarioModif?: string;
  estadoLocal?: "ACEPTADO" | "RECHAZADO" | "MODIFICADO" | null;
  esVacio?: boolean;

  onAceptar?: (nuevaDescripcion: string) => void;
  onRechazar?: () => void;
  onModificar?: (documentId: string, textoModificado: string, comentario: string) => void;
}

export default function CorreccionCard({
  documentId,
  identificador,
  tipoAmbiguedad,
  explicacionAmbiguedad,
  descripcionGenerada,
  nombreRequisito,
  descripcionOriginal,
  comentarioModif,
  estadoLocal = null,
  esVacio = false,
  onAceptar,
  onRechazar,
  onModificar,
}: Props) {
  const theme = useTheme();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [textoEditado, setTextoEditado] = useState(descripcionGenerada);
  const [comentario, setComentario] = useState(comentarioModif ?? "Modificado manualmente");

  const estadoVisual = esVacio
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

  let etiquetaEstado: string | null = null;
  if (estadoLocal === "ACEPTADO") {
    etiquetaEstado = "✅ Requisito marcado como ACEPTADO";
  } else if (estadoLocal === "RECHAZADO") {
    etiquetaEstado = "❌ Requisito marcado como RECHAZADO";
  } else if (estadoLocal === "MODIFICADO") {
    etiquetaEstado = "✏️ Requisito MODIFICADO manualmente";
  } else if (esVacio) {
    etiquetaEstado = "No se pudo detectó ambigüedad con el análisis automático.";
  }

  return (
    <Paper sx={{ my: 4, p: 3, position: "relative", transition: "0.3s", ...estadoVisual }}>
      {/* Badge */}
      {(estadoLocal || esVacio) && (
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
      )}

      <Typography variant="h6" gutterBottom>
        {identificador} - {nombreRequisito}
      </Typography>
      <Typography variant="body2" fontStyle="italic" gutterBottom>
        {descripcionOriginal}
      </Typography>

      <Box sx={{ display: "flex", gap: 4, my: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            width: "30%",
            bgcolor: alpha(theme.palette.background.paper, 0.6),
          }}>
          <Typography variant="subtitle2">Tipo de ambigüedad</Typography>
          <Typography>{tipoAmbiguedad || "—"}</Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            width: "70%",
            bgcolor: alpha(theme.palette.background.paper, 0.6),
          }}>
          <Typography variant="subtitle2">Explicación</Typography>
          <Typography>{explicacionAmbiguedad || "—"}</Typography>
        </Box>
      </Box>

      <Paper
        elevation={1}
        sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
        <Typography fontWeight="bold" mb={1}>
          Corrección sugerida
        </Typography>
        {modoEdicion ? (
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={textoEditado}
            onChange={(e) => setTextoEditado(e.target.value)}
          />
        ) : (
          <Typography>{descripcionGenerada || "—"}</Typography>
        )}
      </Paper>

      {modoEdicion && (
        <TextField
          fullWidth
          label="Comentario de modificación"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          sx={{ mb: 2, bgcolor: alpha(theme.palette.background.paper, 0.6) }}
        />
      )}

      {etiquetaEstado && (
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
          {etiquetaEstado}
        </Typography>
      )}

      {!esVacio && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          {!modoEdicion ? (
            <>
              <Button variant="outlined" color="warning" onClick={() => setModoEdicion(true)}>
                Modificar
              </Button>
              <Button variant="contained" color="error" onClick={onRechazar}>
                Rechazar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => onAceptar?.(descripcionGenerada)}>
                Aceptar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setModoEdicion(false);
                  setTextoEditado(descripcionGenerada);
                }}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  onModificar?.(documentId, textoEditado, comentario);
                  setModoEdicion(false);
                }}>
                Guardar cambio
              </Button>
            </>
          )}
        </Stack>
      )}
    </Paper>
  );
}
