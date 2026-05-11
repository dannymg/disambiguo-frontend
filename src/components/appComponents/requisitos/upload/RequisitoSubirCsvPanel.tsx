"use client";

import { Stack, Typography, Divider, Input, Button, Alert, Paper } from "@mui/material";
import { UploadFile as UploadFileIcon, Download as DownloadIcon } from "@mui/icons-material";

interface Props {
  onArchivoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescargarPlantilla: () => void;
  error: string | null;
}

export default function RequisitoSubirCsvPanel({
  onArchivoChange,
  onDescargarPlantilla,
  error,
}: Props) {
  return (
    <>
      <Paper
        variant="outlined"
        sx={{ p: 3, mb: 2, borderRadius: 2, bgcolor: (theme) => theme.palette.background.paper }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <UploadFileIcon fontSize="large" color="primary" />
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              Selecciona un archivo .CSV
            </Typography>
            <Input
              type="file"
              inputProps={{ accept: ".csv" }}
              onChange={onArchivoChange}
              fullWidth
            />
          </Stack>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          El archivo debe incluir las columnas:
          <br />
          <strong>identificador</strong> (ej. RF-001), <strong>nombre</strong>,{" "}
          <strong>descripcion</strong> y <strong>prioridad</strong> (ALTA, MEDIA, BAJA).
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={onDescargarPlantilla}
          size="small"
          sx={{ mt: 2 }}>
          Descargar plantilla CSV
        </Button>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}
    </>
  );
}
