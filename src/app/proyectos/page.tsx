'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Paper, Typography } from '@mui/material';
import DashboardLayout from '@/components/ui/others/DashBoardLayout';
import ProjectForm from '@/components/ui/forms/ProyectoForm';
import { proyectoService } from '@/services/api/proyecto-service';
import { Proyecto } from '@/types/entities';

export default function CrearProyectoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (proyectoData: Partial<Proyecto>) => {
    try {
      setLoading(true);
      await proyectoService.createProyecto(proyectoData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Crear Nuevo Proyecto
          </Typography>
          <ProjectForm onSubmit={handleSubmit} loading={loading} />
        </Paper>
      </Container>
    </DashboardLayout>
  );
}