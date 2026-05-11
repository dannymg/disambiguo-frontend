"use client";

import { Paper, TextField, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface Props {
  modoEdicion: boolean;
  descripcionGenerada: string;
  textoEditado: string;
  onTextoChange: (valor: string) => void;
  comentario: string;
  onComentarioChange: (valor: string) => void;
}

export default function CorreccionCardSugerencia({
  modoEdicion,
  descripcionGenerada,
  textoEditado,
  onTextoChange,
  comentario,
  onComentarioChange,
}: Props) {
  const theme = useTheme();

  return (
    <>
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
            onChange={(e) => onTextoChange(e.target.value)}
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
          onChange={(e) => onComentarioChange(e.target.value)}
          sx={{ mb: 2, bgcolor: alpha(theme.palette.background.paper, 0.6) }}
        />
      )}
    </>
  );
}
