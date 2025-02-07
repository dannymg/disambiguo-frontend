'use client';

import { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { versionService } from '@/api/version-service';
import { Requisito } from '@/types/entities';
import { useParams } from 'next/navigation';


export default function RequisitoPage() {
  const { proyectoId, requisitoId } = useParams() as { proyectoId: string , requisitoId: string}; // Forzar que sea string
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState<'ALTA' | 'MEDIA' | 'BAJA'>('ALTA');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await versionService.createVersionRequisito(
        { identificador: `RF-${Date.now()}`, tipo: 'Funcional', proyecto: { id: Number(params.id) } },
        { nombre, descripcion, prioridad, esVersionActiva: true }
      );
      router.push(`/proyectos/${params.id}`);
    } catch (error) {
      console.error('Error al crear el requisito:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Crear Requisito
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Requisito'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}