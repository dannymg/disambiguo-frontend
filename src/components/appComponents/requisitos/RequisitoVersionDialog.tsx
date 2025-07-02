import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Radio,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import { Requisito } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  versiones: Requisito[];
  onSelect: (requisitoId: string) => void;
  activoId: string;
}

export default function RequisitoVersionDialog({
  open,
  onClose,
  versiones,
  onSelect,
  activoId,
}: Props) {
  const [selectedId, setSelectedId] = React.useState(activoId);

  React.useEffect(() => {
    if (open && activoId) {
      setSelectedId(activoId);
    }
  }, [open, activoId]);

  const handleConfirm = () => {
    if (selectedId !== activoId) {
      onSelect(selectedId);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar versión activa</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Elige cuál de las versiones deseas establecer como activa.
        </Typography>

        {[
          ...versiones.filter((v) => v.documentId === activoId),
          ...versiones
            .filter((v) => v.documentId !== activoId)
            .sort((a, b) => b.version - a.version),
        ].map((v) => {
          const isActiva = v.documentId === activoId;
          return (
            <Paper
              key={v.documentId}
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "flex-start",
                borderColor: isActiva ? "primary.main" : "grey.300",
                backgroundColor: isActiva ? "rgba(0, 123, 255, 0.05)" : "transparent",
              }}>
              <Radio
                checked={selectedId === v.documentId}
                onChange={() => setSelectedId(v.documentId)}
                sx={{ mt: 1 }}
              />
              <Box sx={{ ml: 2, flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {v.nombre}
                  {isActiva && (
                    <Chip label="Versión activa" color="success" size="small" sx={{ ml: 2 }} />
                  )}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {v.descripcion}
                </Typography>

                <Box sx={{ mt: 1, display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Chip
                    label={`Prioridad: ${v.prioridad}`}
                    color={
                      v.prioridad === "ALTA"
                        ? "error"
                        : v.prioridad === "MEDIA"
                          ? "warning"
                          : "info"
                    }
                    size="small"
                  />
                  <Chip
                    label={`Estado: ${v.estadoRevision}`}
                    color={v.estadoRevision === "PENDIENTE" ? "warning" : "success"}
                    size="small"
                  />
                  <Chip label={`Versión ${v.version}.0`} variant="outlined" size="small" />
                </Box>
              </Box>
            </Paper>
          );
        })}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleConfirm} disabled={selectedId === activoId}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
