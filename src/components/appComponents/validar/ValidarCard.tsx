"use client";

import { Paper, Typography, Box, Stack, Button, Chip, useTheme } from "@mui/material";

import ValidarCardStatusDot from "./ValidarCardStatusDot";
import { estadoContenedorValidacion, etiquetaValidacion } from "./validarCardEstilos";
import EstadoChip from "../shared/table/EstadoChip";

interface Props {
  documentId: string;
  identificador: string;
  nombre: string;
  descripcion: string;
  estado: string;
  version: number;

  estadoLocal?: "VALIDADO" | "NO_VALIDADO" | null;

  onValidar?: () => void;
  onRechazar?: () => void;
}

export default function ValidarCard({
  identificador,
  nombre,
  descripcion,
  estado,
  version,
  estadoLocal = null,
  onValidar,
  onRechazar,
}: Props) {
  const theme = useTheme();

  const estilo = estadoContenedorValidacion(theme, estadoLocal);
  const etiqueta = etiquetaValidacion(estadoLocal);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        position: "relative",
        transition: "all 0.2s",
        "&:hover": { boxShadow: 3 },
        ...estilo,
      }}>
      <ValidarCardStatusDot visible={!!estadoLocal} estadoLocal={estadoLocal} />

      {/* HEADER */}
      <Stack spacing={0.5} mb={2}>
        <Typography variant="caption" color="text.secondary">
          {identificador}
        </Typography>

        <Typography variant="h6" fontWeight={600}>
          {nombre}
        </Typography>
      </Stack>

      {/* DESCRIPCIÓN */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "background.default",
          mb: 2,
        }}>
        <Typography variant="body2">{descripcion}</Typography>
      </Box>

      {/* INFO */}
      <Stack direction="row" spacing={1} mb={2}>
        <EstadoChip estado={estado} />

        <Chip label={`Versión ${version}.0`} size="small" variant="outlined" />
      </Stack>

      {/* ESTADO */}
      {etiqueta && (
        <Box mb={2}>
          <Chip label={etiqueta} color={estadoLocal === "VALIDADO" ? "success" : "error"} />
        </Box>
      )}

      {/* ACCIONES */}
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="success" onClick={onValidar}>
          Validar
        </Button>

        <Button variant="outlined" color="error" onClick={onRechazar}>
          Rechazar
        </Button>
      </Stack>
    </Paper>
  );
}
