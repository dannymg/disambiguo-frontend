"use client";

import { Paper, Typography, Box, TextField, Button, Stack } from "@mui/material";
import { useState } from "react";

interface Props {
  documentId: string;
  identificador: string;
  tipoAmbiguedad: string;
  explicacionAmbiguedad: string;
  descripcionGenerada: string;
  nombreRequisito: string;
  descripcionOriginal: string;
  rechazado?: boolean;
  aceptado?: boolean;

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
  rechazado = false,
  aceptado = false,
  onAceptar,
  onRechazar,
  onModificar,
}: Props) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [textoEditado, setTextoEditado] = useState(descripcionGenerada);
  const [comentario, setComentario] = useState("Modificado manualmente");

  const estadoVisual = rechazado
    ? {
        opacity: 0.5,
        border: "2px dashed #d32f2f",
        backgroundColor: "#fff3f3",
      }
    : aceptado
      ? {
          border: "2px solid #388e3c",
          backgroundColor: "#e6f4ea",
        }
      : {};

  return (
    <Paper sx={{ my: 4, p: 3, ...estadoVisual }}>
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
            bgcolor: (theme) => theme.palette.background.default,
          }}>
          <Typography variant="subtitle2">Tipo de ambigüedad</Typography>
          <Typography>{tipoAmbiguedad}</Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            width: "70%",
            bgcolor: (theme) => theme.palette.background.default,
          }}>
          <Typography variant="subtitle2">Explicación</Typography>
          <Typography>{explicacionAmbiguedad}</Typography>
        </Box>
      </Box>

      <Paper
        elevation={1}
        sx={{ p: 2, mb: 2, bgcolor: (theme) => theme.palette.background.default }}>
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
          <Typography>{descripcionGenerada}</Typography>
        )}
      </Paper>

      {modoEdicion && (
        <TextField
          fullWidth
          label="Comentario de modificación"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          sx={{ mb: 2, bgcolor: "background.default" }}
        />
      )}

      {rechazado && (
        <Typography color="error" fontWeight="bold" mt={2}>
          ❌ Este requisito ha sido rechazado.
        </Typography>
      )}

      {aceptado && (
        <Typography color="success.main" fontWeight="bold" mt={2}>
          ✅ Este requisito ha sido aceptado.
        </Typography>
      )}

      {!rechazado && !aceptado && (
        <Stack direction="row" spacing={2} justifyContent="flex-end">
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
