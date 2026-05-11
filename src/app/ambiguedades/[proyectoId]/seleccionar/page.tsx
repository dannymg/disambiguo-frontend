"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Box, Typography, Button, Stack, Paper } from "@mui/material";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loading from "@/components/common/Dialogs/Loading";

import { proyectoService } from "@/api/proyectoService";
import { versionService } from "@/api/versionRequisitoService";
import { Proyecto, VersionRequisito } from "@/types";

import RequisitosSeleccionablesTable from "@/components/appComponents/ambiguedades/RequisitosSeleccionablesTable";
import AmbiguedadesHeader from "@/components/appComponents/ambiguedades/AmbiguedadesHeader";

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
        const proyectoData = await proyectoService.getProyectoByDocumentId(proyectoId);
        setProyecto(proyectoData);

        const requisitosData = await versionService.getAllVersionesYRequisitoActivo(proyectoId);
        setRequisitos(requisitosData);

        // PRESELECCIÓN DE REQUISITOS NO REVISADOS
        const preseleccionados = requisitosData
          .filter((r) => {
            const activa = r.requisito?.find((req) => req.esVersionActiva);
            return activa?.estadoRevision === "NO_REVISADO";
          })
          .map((r) => r.documentId);

        setSelectedRequisitos(preseleccionados);
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
      checked ? [...new Set([...prev, ...ids])] : prev.filter((id) => !ids.includes(id))
    );
  };

  const handleAnalizar = () => {
    if (selectedRequisitos.length === 0) return;

    const identificadores = requisitos
      .filter((r) => selectedRequisitos.includes(r.documentId))
      .map((r) => r.identificador)
      .filter(Boolean);

    router.push(`/ambiguedades/${proyectoId}/detectar?requisitos=${identificadores.join(",")}`);
  };

  if (loading) return <Loading />;

  if (!proyecto || requisitos.length === 0) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
          }}>
          <Paper
            elevation={2}
            sx={{
              p: 5,
              maxWidth: 520,
              textAlign: "center",
              borderRadius: 3,
            }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              No hay requisitos disponibles
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Este proyecto aún no tiene requisitos registrados o no se han cargado versiones
              activas para su análisis de ambigüedades.
            </Typography>

            <Stack spacing={2} alignItems="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push(`/ambiguedades`)}
                sx={{ textTransform: "none", px: 4 }}>
                Volver a ambigüedades
              </Button>

              <Button
                variant="text"
                onClick={() => router.push(`/proyectos/${proyectoId}`)}
                sx={{ textTransform: "none" }}>
                Ir al proyecto
              </Button>
            </Stack>
          </Paper>
        </Box>
      </DashboardLayout>
    );
  }

  const requisitosFuncionales = requisitos.filter((r) => r.identificador?.startsWith("RF"));
  const requisitosNoFuncionales = requisitos.filter((r) => r.identificador?.startsWith("RNF"));

  return (
    <DashboardLayout>
      <Box sx={{ mt: 4, mb: 10, px: { xs: 2, md: 3 } }}>
        {/* HEADER igual que proyectos */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <AmbiguedadesHeader
            title="Selección de requisitos"
            subtitle={`Proyecto: ${proyecto.titulo}`}
          />
        </Stack>

        {/* TABLAS */}
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

        {/* 🔥 BARRA STICKY (adaptada al layout) */}
        <Paper
          elevation={3}
          sx={{
            position: "sticky",
            bottom: 0,
            mt: 3,
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            zIndex: 10,
          }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}>
            <Typography variant="body1">
              {selectedRequisitos.length} requisito(s) seleccionado(s)
            </Typography>

            <Button
              variant="contained"
              size="large"
              disabled={selectedRequisitos.length === 0}
              onClick={handleAnalizar}
              sx={{ textTransform: "none" }}>
              Analizar requisitos
            </Button>
          </Stack>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
