'use client'

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, CircularProgress} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { proyectoService } from '@/services/api/proyecto-service';
import { Proyecto } from '@/types/entities';
import { useAuth } from '@/services/auth/auth-context';
import ProjectCard from '@/components/ui/others/ProjectCard';
import DashboardLayout from '@/components/ui/others/DashBoardLayout';

export default function DashboardPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProyectos = async () => {
      if (!authLoading && user) {
        try {
          const data = await proyectoService.getProyectos();
          setProyectos(data);
        } catch (error) {
          console.error('Error al cargar proyectos:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProyectos();
  }, [user, authLoading]);

  const handleCreateProject = () => {
    router.push('/proyectos/crear');
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Mis Proyectos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
          >
            Crear Proyecto
          </Button>
        </Box>

        {proyectos.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight="400px"
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes ningún proyecto creado
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateProject}
              sx={{ mt: 2 }}
            >
              Crear mi primer proyecto
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {proyectos.map((proyecto) => (
              <Grid item xs={12} sm={6} md={4} key={proyecto.id}>
                <ProjectCard proyecto={proyecto} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </DashboardLayout>
  );
}

