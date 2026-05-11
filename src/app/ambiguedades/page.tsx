"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { proyectoService } from "@/api/proyectoService";
import type { Proyecto } from "@/types";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loading from "@/components/common/Dialogs/Loading";
import AmbiguedadesHeader from "@/components/appComponents/ambiguedades/AmbiguedadesHeader";

export default function AmbiguedadPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await proyectoService.getAllProyectos();
        setProyectos(data);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProyectos();
  }, []);

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <AmbiguedadesHeader
            title="Análisis de Ambigüedades"
            subtitle="Selecciona un proyecto para revisar o validar requisitos."
          />
        </Stack>

        {proyectos.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron proyectos disponibles.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Proyecto</TableCell>
                  <TableCell align="center">Total de Requisitos</TableCell>
                  <TableCell align="center">Estado de Revisión</TableCell>
                  <TableCell align="center">Progreso de Validación</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {proyectos.map((proyecto, index) => {
                  const total = proyecto.listaRequisitos?.length || 0;

                  const pendientes =
                    proyecto.listaRequisitos?.filter((v) => {
                      const activa = v.requisito?.find((r) => r.esVersionActiva);
                      return activa?.estadoRevision === "NO_REVISADO";
                    }).length || 0;

                  const validados =
                    proyecto.listaRequisitos?.filter((v) => {
                      const activa = v.requisito?.find((r) => r.esVersionActiva);
                      return activa?.estadoRevision === "VALIDADO";
                    }).length || 0;

                  const progreso = total > 0 ? (validados / total) * 100 : 0;

                  return (
                    <TableRow key={proyecto.documentId} hover>
                      <TableCell>{index + 1}</TableCell>

                      {/* Proyecto */}
                      <TableCell>
                        <Tooltip title={proyecto.titulo}>
                          <Typography fontWeight={600} noWrap sx={{ maxWidth: 480 }}>
                            {proyecto.titulo}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* NUEVA COLUMNA: Total */}
                      <TableCell align="center">
                        <Typography fontWeight={600}>{total}</Typography>
                      </TableCell>

                      {/* Estado (SOLO pendientes) */}
                      <TableCell align="center">
                        <Chip label={`Pendientes: ${pendientes}`} color="warning" size="small" />
                      </TableCell>

                      {/* Progreso */}
                      <TableCell align="center" sx={{ minWidth: 140 }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {validados} / {total}
                        </Typography>
                        {total > 0 && (
                          <LinearProgress
                            variant="determinate"
                            value={progreso}
                            sx={{ height: 6, borderRadius: 5, maxWidth: 140, mx: "auto" }}
                          />
                        )}
                      </TableCell>

                      {/* Acciones */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Revisar requisitos">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                router.push(`/ambiguedades/${proyecto.documentId}/seleccionar`)
                              }>
                              <VisibilityIcon fontSize="small" />
                              Revisar
                            </Button>
                          </Tooltip>

                          <Tooltip title="Validar requisitos">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                router.push(`/ambiguedades/${proyecto.documentId}/validar`)
                              }>
                              <TaskAltIcon fontSize="small" />
                              Validar
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </DashboardLayout>
  );
}
