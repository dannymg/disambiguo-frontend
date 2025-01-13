import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Proyecto } from '@/types/entities';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  proyecto: Proyecto;
}

export default function ProjectCard({ proyecto }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {proyecto.titulo}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {proyecto.descripcion}
        </Typography>
        <Box display="flex" gap={1} mb={2}>
          <Chip 
            label={`v${proyecto.version}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={proyecto.esActivo ? 'Activo' : 'Inactivo'} 
            size="small" 
            color={proyecto.esActivo ? 'success' : 'default'} 
            variant="outlined" 
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          startIcon={<EditIcon />}
          onClick={() => router.push(`/proyectos/${proyecto.id}`)}
        >
          Editar
        </Button>
        <Button 
          size="small" 
          color="error" 
          startIcon={<DeleteIcon />}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
}
