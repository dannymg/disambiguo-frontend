"use client";

import { useEffect, useState } from "react";

import {
  Box,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Typography,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SettingsIcon from "@mui/icons-material/Settings";
import TableViewIcon from "@mui/icons-material/TableView";
import GridOnIcon from "@mui/icons-material/GridOn";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { buildReportData } from "@/components/appComponents/reportes/buildReportData";
import { generatePDF } from "@/components/appComponents/reportes/generatePDF";

import { proyectoService } from "@/api/proyectoService";

import type { Proyecto } from "@/types";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loading from "@/components/common/Dialogs/Loading";
import AmbiguedadesHeader from "@/components/appComponents/ambiguedades/AmbiguedadesHeader";

const defaultConfig = {
  resumen: true,
  requisitos: true,
  historial: true,
  recomendaciones: true,
};

const getStorageKey = (id: string) => `reportConfig_${id}`;

const loadConfig = (id: string) => {
  try {
    const stored = localStorage.getItem(getStorageKey(id));

    if (!stored) {
      localStorage.setItem(getStorageKey(id), JSON.stringify(defaultConfig));

      return { ...defaultConfig };
    }

    const parsed = JSON.parse(stored);

    return {
      ...defaultConfig,
      ...parsed,
    };
  } catch {
    return { ...defaultConfig };
  }
};

const saveConfig = (id: string, config: any) => {
  localStorage.setItem(getStorageKey(id), JSON.stringify(config));
};

export default function ReportesPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  const [openConfig, setOpenConfig] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);

  const [openExport, setOpenExport] = useState(false);
  const [exportProyecto, setExportProyecto] = useState<Proyecto | null>(null);

  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    const fetch = async () => {
      const data = await proyectoService.getAllProyectosForReporte();

      setProyectos(data);
      setLoading(false);
    };

    fetch();
  }, []);

  const getActiveRequirements = (proyecto: Proyecto) => {
    return (
      proyecto.listaRequisitos
        ?.map((v) => v.requisito?.find((r) => r.esVersionActiva))
        .filter((r): r is NonNullable<typeof r> => Boolean(r)) || []
    );
  };

  const getMetrics = (proyecto: Proyecto) => {
    const reqs = getActiveRequirements(proyecto);

    const total = reqs.length;

    const ambiguos = reqs.filter((r) => r.estadoRevision === "AMBIGUO").length;

    const validados = reqs.filter((r) => r.estadoRevision === "VALIDADO").length;

    const otros = total - ambiguos - validados;

    return {
      total,
      ambiguos,
      validados,
      otros,
      porcentajeAmbiguedad: total ? (ambiguos / total) * 100 : 0,
    };
  };

  const hasRequisitos = (proyecto: Proyecto) => {
    return getActiveRequirements(proyecto).length > 0;
  };

  const handleOpenConfig = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);

    setConfig(loadConfig(proyecto.documentId));

    setOpenConfig(true);
  };

  const handleSaveConfig = () => {
    if (!selectedProyecto) return;

    saveConfig(selectedProyecto.documentId, config);

    setOpenConfig(false);
  };

  const handleGeneratePDF = (proyecto: Proyecto) => {
    const conf = loadConfig(proyecto.documentId);

    const data = buildReportData(proyecto, conf);

    generatePDF(data);
  };

  const handleOpenExport = (proyecto: Proyecto) => {
    setExportProyecto(proyecto);
    setOpenExport(true);
  };

  const handleExportCSV = (proyecto: Proyecto) => {
    const requisitos = getActiveRequirements(proyecto);

    const headers = ["identificador", "nombre", "descripcion", "prioridad"];

    const rows = requisitos.map((r) => [
      r.idVersionado?.identificador ?? "",
      `"${(r.nombre ?? "").replace(/"/g, '""')}"`,
      `"${(r.descripcion ?? "").replace(/"/g, '""')}"`,
      r.prioridad,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, `${proyecto.titulo}-requisitos.csv`);

    setOpenExport(false);
  };

  const handleExportExcel = (proyecto: Proyecto) => {
    const requisitos = getActiveRequirements(proyecto);

    const data = requisitos.map((r) => ({
      Identificador: r.idVersionado?.identificador ?? "",
      Nombre: r.nombre,
      Descripción: r.descripcion,
      Prioridad: r.prioridad,
      Estado: r.estadoRevision,
      Versión: r.version,
      "Última actualización": r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 35 },
      { wch: 60 },
      { wch: 15 },
      { wch: 20 },
      { wch: 10 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Requisitos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `${proyecto.titulo}-requisitos.xlsx`);

    setOpenExport(false);
  };

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <Box sx={{ mt: 4 }}>
        <AmbiguedadesHeader title="Reportes" subtitle="Generación y exportación de informes" />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>

                <TableCell>Proyecto</TableCell>

                <TableCell align="center">Requisitos</TableCell>

                <TableCell align="center">Ambiguos</TableCell>

                <TableCell align="center">Validados</TableCell>

                <TableCell align="center">Otros</TableCell>

                <TableCell align="center">% Ambigüedad</TableCell>

                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {proyectos.map((p, i) => {
                const m = getMetrics(p);

                const enabled = hasRequisitos(p);

                return (
                  <TableRow
                    key={p.documentId}
                    sx={{
                      opacity: enabled ? 1 : 0.5,
                      backgroundColor: enabled ? "inherit" : "#fafafa",
                    }}>
                    <TableCell>{i + 1}</TableCell>

                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 300 }}>
                        {p.titulo}
                      </Typography>

                      {!enabled && (
                        <Typography variant="caption" color="text.secondary">
                          Sin requisitos registrados
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">{m.total}</TableCell>

                    <TableCell align="center">
                      <Chip label={m.ambiguos} color="error" size="small" />
                    </TableCell>

                    <TableCell align="center">
                      <Chip label={m.validados} color="success" size="small" />
                    </TableCell>

                    <TableCell align="center">
                      <Chip label={m.otros} color="warning" size="small" />
                    </TableCell>

                    <TableCell align="center">
                      {m.porcentajeAmbiguedad.toFixed(1)}%
                      <LinearProgress value={m.porcentajeAmbiguedad} variant="determinate" />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {/* PDF */}
                        <Tooltip
                          title={
                            enabled ? "Generar reporte PDF" : "No hay requisitos en este proyecto"
                          }>
                          <span>
                            <Button disabled={!enabled} onClick={() => handleGeneratePDF(p)}>
                              <PictureAsPdfIcon />
                            </Button>
                          </span>
                        </Tooltip>

                        {/* CONFIG */}
                        <Tooltip
                          title={enabled ? "Configurar reporte" : "No disponible sin requisitos"}>
                          <span>
                            <Button disabled={!enabled} onClick={() => handleOpenConfig(p)}>
                              <SettingsIcon />
                            </Button>
                          </span>
                        </Tooltip>

                        {/* EXPORT */}
                        <Tooltip
                          title={
                            enabled
                              ? "Exportar requisitos CSV / Excel"
                              : "No disponible sin requisitos"
                          }>
                          <span>
                            <Button disabled={!enabled} onClick={() => handleOpenExport(p)}>
                              <TableViewIcon />
                            </Button>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* CONFIG */}
        <Dialog open={openConfig} onClose={() => setOpenConfig(false)} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              fontWeight: 700,
              pb: 1,
            }}>
            Configurar reporte
          </DialogTitle>

          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selecciona las secciones que deseas incluir en el informe PDF.
            </Typography>

            <Stack spacing={2}>
              {/* RESUMEN */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}>
                <FormControlLabel
                  sx={{
                    width: "100%",
                    m: 0,
                    alignItems: "flex-start",
                  }}
                  control={
                    <Checkbox
                      checked={!!config.resumen}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          resumen: e.target.checked,
                        })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={600}>Resumen ejecutivo</Typography>

                      <Typography variant="body2" color="text.secondary">
                        Incluye estadísticas generales y porcentajes del análisis realizado.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* REQUISITOS */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}>
                <FormControlLabel
                  sx={{
                    width: "100%",
                    m: 0,
                    alignItems: "flex-start",
                  }}
                  control={
                    <Checkbox
                      checked={!!config.requisitos}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          requisitos: e.target.checked,
                        })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={600}>Listado de requisitos finales</Typography>

                      <Typography variant="body2" color="text.secondary">
                        Muestra los requisitos validados y otros requisitos registrados.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* HISTORIAL */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}>
                <FormControlLabel
                  sx={{
                    width: "100%",
                    m: 0,
                    alignItems: "flex-start",
                  }}
                  control={
                    <Checkbox
                      checked={config.historial ?? false}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          historial: e.target.checked,
                        })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={600}>Historial de requisitos</Typography>

                      <Typography variant="body2" color="text.secondary">
                        Incluye todas las versiones, revisiones, ambigüedades y correcciones
                        generadas.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* RECOMENDACIONES */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}>
                <FormControlLabel
                  sx={{
                    width: "100%",
                    m: 0,
                    alignItems: "flex-start",
                  }}
                  control={
                    <Checkbox
                      checked={!!config.recomendaciones}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          recomendaciones: e.target.checked,
                        })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={600}>Recomendaciones</Typography>

                      <Typography variant="body2" color="text.secondary">
                        Agrega buenas prácticas basadas en la norma ISO/IEC/IEEE 29148:2018.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              justifyContent: "space-between",
            }}>
            <Button onClick={() => setConfig({ ...defaultConfig })} color="inherit">
              Restaurar
            </Button>

            <Button variant="contained" onClick={handleSaveConfig}>
              Guardar configuración
            </Button>
          </DialogActions>
        </Dialog>

        {/* EXPORTAR */}
        <Dialog open={openExport} onClose={() => setOpenExport(false)} maxWidth="xs" fullWidth>
          <DialogTitle
            sx={{
              fontWeight: 700,
            }}>
            Exportar requisitos
          </DialogTitle>

          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selecciona el formato en el que deseas exportar los requisitos activos del proyecto.
            </Typography>

            <Stack spacing={2}>
              {/* CSV */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TableViewIcon fontSize="small" />

                    <Typography fontWeight={600}>CSV</Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Exporta los requisitos en formato compatible con la carga masiva del sistema.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<TableViewIcon />}
                    onClick={() => exportProyecto && handleExportCSV(exportProyecto)}>
                    Exportar CSV
                  </Button>
                </Stack>
              </Paper>

              {/* EXCEL */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <GridOnIcon fontSize="small" />

                    <Typography fontWeight={600}>Excel (.xlsx)</Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Exporta una tabla estructurada con información adicional del estado de
                    validación.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<GridOnIcon />}
                    onClick={() => exportProyecto && handleExportExcel(exportProyecto)}>
                    Exportar Excel
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenExport(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
