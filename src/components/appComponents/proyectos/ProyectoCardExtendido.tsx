import {
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

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
        borderRadius: 3,
        boxShadow: 4,
        position: 'relative',
        minHeight: hasContent ? 'auto' : 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: hasContent ? 'flex-start' : 'center',
        alignItems: hasContent ? 'flex-start' : 'center',
        textAlign: hasContent ? 'inherit' : 'center',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          color="warning"
          onClick={onEdit}
          startIcon={<EditIcon />}
        >
          Editar
        </Button>
        <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={onDelete}
            startIcon={<DeleteIcon />}
          >
            Eliminar
        </Button>
      </Box>

      {hasContent ? (
        <>
          <Typography variant="h4" gutterBottom color="text.primary" fontWeight={700}>
            {titulo}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {descripcion}
          </Typography>

          <Divider sx={{ my: 2 }} />

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
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mt: 1 }}
              >
                {palabrasClave.map((p, i) => (
                  <Chip key={i} label={p} color="primary" variant="outlined" />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No hay información disponible.
        </Typography>
      )}
    </Paper>
  );
}
