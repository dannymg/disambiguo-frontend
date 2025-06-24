import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface Props {
  onCreate: () => void;
}

export default function ProyectosHeader({ onCreate }: Props) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <Typography variant="h4" component="h1" color="text.primary" fontWeight={700}>
        Mis Proyectos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ fontWeight: 600 }}
        startIcon={<AddIcon />}
        onClick={onCreate}>
        Crear Proyecto
      </Button>
    </Box>
  );
}
