'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import {
  Container,
  Typography,
  Box,
  Button
} from '@mui/material';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loading from '@/components/common/Dialogs/Loading';

import { proyectoService } from '@/api/proyectoService';
import { requisitoService } from '@/api/requisitoService';
import { Proyecto, VersionRequisito } from '@/types/entities';

import RequisitosSeleccionablesTable from '@/components/appComponents/ambiguedades/RequisitosSeleccionablesTable';
import AmbiguedadesHeader from '@/components/appComponents/ambiguedades/AmbiguedadesHeader';

export default function AnalizarRequisitoPage() {
  const { proyectoId } = useParams() as { proyectoId: string };
  const router = useRouter();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [requisitos, setRequisitos] = useState<VersionRequisito[]>([]);
  const [selectedRequisitos, setSelectedRequisitos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectoData = await proyectoService.getProyectoById(proyectoId);
        setProyecto(proyectoData);

        const requisitosData = await requisitoService.getAllRequisitos(proyectoId);
        setRequisitos(requisitosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [proyectoId]);

  const handleToggleRequisito = (id: string) => {
    setSelectedRequisitos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (ids: string[], checked: boolean) => {
    setSelectedRequisitos((prev) =>
      checked
        ? [...new Set([...prev, ...ids])]
        : prev.filter((id) => !ids.includes(id))
    );
  };

  const handleAnalizar = () => {
    if (selectedRequisitos.length === 0) {
      alert("Por favor, seleccione al menos un requisito para analizar");
      return;
    }

    const identificadores = requisitos
      .filter((r) => selectedRequisitos.includes(r.documentId))
      .map((r) => r.identificador)
      .filter(Boolean);

    router.push(`/ambiguedades/${proyectoId}/detectar?requisitos=${identificadores.join(',')}`);
  };

  if (loading) return <Loading />;

  if (!proyecto || requisitos.length === 0) {
    return (
      <DashboardLayout>
        <Typography variant="h5" color="error">
          No se encontraron requisitos disponibles para este proyecto.
        </Typography>
      </DashboardLayout>
    );
  }

  const requisitosFuncionales = requisitos.filter(
    (r) => r.identificador?.startsWith('RF')
  );
  const requisitosNoFuncionales = requisitos.filter(
    (r) => r.identificador?.startsWith('RNF')
  );

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <AmbiguedadesHeader 
              title="Selección de requisitos"
              subtitle="Seleccione los requisitos para analizar la presencia de ambigüedades. Se deshabilitarán los requisitos que ya han sido validados." 
            />
        <RequisitosSeleccionablesTable
          title="Requisitos Funcionales (RF)"
          data={requisitosFuncionales}
          selected={selectedRequisitos}
          onToggle={handleToggleRequisito}
          onToggleAll={handleToggleAll}
        />

        <RequisitosSeleccionablesTable
          title="Requisitos No Funcionales (RNF)"
          data={requisitosNoFuncionales}
          selected={selectedRequisitos}
          onToggle={handleToggleRequisito}
          onToggleAll={handleToggleAll}
        />

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedRequisitos.length === 0}
            onClick={handleAnalizar}
          >
            Analizar
          </Button>
        </Box>
      </Container>
    </DashboardLayout>
  );
}
