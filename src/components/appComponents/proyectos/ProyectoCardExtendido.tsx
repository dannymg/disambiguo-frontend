import { Paper, Typography, Box, Divider, Grid, Stack, Chip, Button } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

interface Props {
  titulo: string;
  descripcion: string;
  objetivo: string;
  contexto: string;
  palabrasClave: string[];
  onEdit: () => void;
  onDelete?: () => void;
}

export default function ProyectoCardExtendido({
  titulo,
  descripcion,
  objetivo,
  contexto,
  palabrasClave,
  onEdit,
  onDelete,
}: Props) {
  const hasContent = titulo || descripcion || objetivo || contexto || palabrasClave.length > 0;

  return (
    <Paper
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}>
      {hasContent ? (
        <>
          {/* 🔥 HEADER CORREGIDO */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                {titulo}
              </Typography>

              <Typography variant="body1" color="text.secondary">
                {descripcion}
              </Typography>
            </Box>

            {/* 🔥 BOTONES BIEN UBICADOS */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="warning"
                onClick={onEdit}
                startIcon={<EditIcon />}
                sx={{ borderRadius: 2 }}>
                Editar
              </Button>

              {onDelete && (
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={onDelete}
                  startIcon={<DeleteIcon />}
                  sx={{ borderRadius: 2 }}>
                  Eliminar
                </Button>
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* CONTENIDO */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle2" fontWeight="bold">
                🎯 Objetivo
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {objetivo}
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                🌍 Contexto
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {contexto}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">
                🔑 Palabras clave
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {palabrasClave.map((p, i) => (
                  <Chip key={i} label={p} color="primary" variant="outlined" />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No hay información disponible.
        </Typography>
      )}
    </Paper>
  );
}
