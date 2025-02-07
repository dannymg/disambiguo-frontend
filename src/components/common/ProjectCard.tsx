import { Card, CardContent, CardActions, Typography, Button, Chip, Box, IconButton } from '@mui/material';
import { Proyecto } from '@/types/entities';
import { useRouter } from 'next/navigation';
import { Edit, Visibility } from '@mui/icons-material'; // Iconos adicionales

interface ProjectCardProps {
  proyecto: Proyecto;
}

export default function ProjectCard({ proyecto }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Animación suave
        '&:hover': {
          transform: 'scale(1.03)', // Efecto hover
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada
        },
        borderRadius: 4, // Bordes redondeados
        overflow: 'hidden', // Asegura que el contenido no se desborde
      }}
    >
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        {/* Título del proyecto */}
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'semiBold',
            color: (theme) => theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {proyecto.titulo}
        </Typography>

        {/* Descripción del proyecto */}
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            maxHeight: 60,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {proyecto.descripcion}
        </Typography>

        {/* Chips de estado y versión */}
        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={`v${proyecto.version}.0`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            label={proyecto.esActivo ? 'Activo' : 'Inactivo'}
            size="small"
            color={proyecto.esActivo ? 'success' : 'default'}
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      </CardContent>

      {/* Acciones */}
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<Visibility />}
          onClick={() => router.push(`/proyectos/${proyecto.documentId}`)}
          sx={{ 
            textTransform: 'none',   // Texto sin mayúsculas          
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            }, }} 
        >
          Ver detalles
        </Button>
      </CardActions>
    </Card>
  );
}