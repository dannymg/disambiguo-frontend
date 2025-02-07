'use client'

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { proyectoService } from '@/api/proyecto-service';
import { Proyecto } from '@/types/entities';
import { useAuth } from '@/hooks/auth/auth-context';
import ProjectCard from '@/components/common/ProjectCard';
import DashboardLayout from '@/components/common/DashBoardLayout';
import Loading from '@/components/common/Loading';
import ErrorDialog from '@/components/common/ErrorDialog';

export default function DashboardPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const router = useRouter()
  const { user, isLoading, isAnalista } = useAuth()

  useEffect(() => {
    const fetchProyectos = async () => {
      if (!isLoading && user) {
        try {
          const data = await proyectoService.getAllProyectos()
          setProyectos(data)
        } catch (error) {
          console.error("Error al cargar proyectos:", error)
          // Si hay un error de autenticación, redirigir al login
          if (error instanceof Error && error.message.includes("401")) {
            router.push("/login")
          }
        } finally {
          setLoading(false)
        }
      } else if (!isLoading && !user) {
        router.push("/login")
      }
    }

    fetchProyectos()
  }, [user, isLoading, router])

  const handleCreateProject = () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!isAnalista) {
      setErrorDialogOpen(true)
      return
    }

    router.push("/proyectos/crear")
  }

  if (isLoading || loading) {
    return <Loading />
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Mis Proyectos
          </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateProject}>
              Crear Proyecto
            </Button>
        
        </Box>

        {proyectos.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
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
      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Permiso denegado"
        message="No tienes permisos para crear proyectos. Solo los analistas pueden crear proyectos."
      />
    </DashboardLayout>
  )
}