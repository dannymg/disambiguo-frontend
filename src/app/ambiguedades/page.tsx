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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { proyectoService } from "@/api/proyectoService";
import type { Proyecto } from "@/types";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loading from "@/components/common/Dialogs/Loading";
import { HelpOutline as HelpOutlineIcon } from "@mui/icons-material";
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <AmbiguedadesHeader
              title="Análisis de Ambigüedades"
              subtitle="Selecciona un proyecto para revisar los requisitos no analizados, o validar los ya analizados."
            />
          </Box>
          <HelpOutlineIcon color="disabled" />
        </Stack>

        {proyectos.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron proyectos disponibles.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Asegúrate de haber creado al menos un proyecto con requisitos.
            </Typography>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 0 10px rgba(255,255,255,0.05)"
                  : "0 0 10px rgba(0,0,0,0.05)",
            }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>Nombre</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    Total requisitos
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    R. no revisados
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    R. validados
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {proyectos.map((proyecto, index) => {
                  const totalRequisitos = proyecto.listaRequisitos?.length || 0;

                  const requisitosPendientes =
                    proyecto.listaRequisitos?.filter((version) => {
                      const activa = version.requisito?.find((r) => r.esVersionActiva);
                      console.log("Requisito activa pendientes:", activa);
                      return activa?.estadoRevision === "PENDIENTE";
                    }).length || 0;

                  const requisitosValidados =
                    proyecto.listaRequisitos?.filter((version) => {
                      const activa = version.requisito?.find((r) => r.esVersionActiva);
                      console.log("Requisito activa validados:", activa);
                      return activa?.estadoRevision === "VALIDADO";
                    }).length || 0;

                  return (
                    <TableRow
                      key={proyecto.documentId}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark" ? "grey.900" : "grey.100",
                        },
                        transition: "background-color 0.2s ease-in-out",
                      }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                        {proyecto.titulo}
                      </TableCell>
                      <TableCell align="center">{totalRequisitos}</TableCell>
                      <TableCell align="center">{requisitosPendientes}</TableCell>
                      <TableCell align="center">{requisitosValidados}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            sx={{ textTransform: "none", borderRadius: 2, fontWeight: "medium" }}
                            onClick={() =>
                              router.push(`/ambiguedades/${proyecto.documentId}/seleccionar`)
                            }>
                            Revisar
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<TaskAltIcon />}
                            sx={{ textTransform: "none", borderRadius: 2, fontWeight: "medium" }}
                            onClick={() =>
                              router.push(`/ambiguedades/${proyecto.documentId}/validar`)
                            }>
                            Validar
                          </Button>
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
