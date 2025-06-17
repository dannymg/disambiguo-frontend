// components/proyectos/ProyectosEmptyState.tsx
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface Props {
  onCreate: () => void;
}

export default function ProyectosEmptyState({ onCreate }: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
    >
      <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
        No tienes ningún proyecto creado
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreate}
        sx={{ mt: 2  , fontWeight: 600 }}
      >
        Crear mi primer proyecto
      </Button>
    </Box>
  );
}
