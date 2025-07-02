"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArrowDropUp, ArrowDropDown, UnfoldMore } from "@mui/icons-material";
import { useState } from "react";
import { VersionRequisito } from "@/types";

interface Props {
  title: string;
  data: VersionRequisito[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
}

type ColumnKey =
  | "identificador"
  | "nombre"
  | "descripcion"
  | "prioridad"
  | "estadoRevision"
  | "version";
type SortOrder = "asc" | "desc";

export default function RequisitosSeleccionablesTable({
  title,
  data,
  selected,
  onToggle,
  onToggleAll,
}: Props) {
  const [sortColumn, setSortColumn] = useState<ColumnKey>("identificador");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const prioridadOrden = ["ALTA", "MEDIA", "BAJA"];

  const seleccionables = data.filter((r) => r.requisito?.[0]?.estadoRevision !== "VALIDADO");

  const sortedData = [...data].sort((a, b) => {
    const aReq = a.requisito?.[0];
    const bReq = b.requisito?.[0];
    if (!aReq || !bReq) return 0;

    let valA: any, valB: any;
    switch (sortColumn) {
      case "identificador":
        valA = a.identificador;
        valB = b.identificador;
        break;
      case "nombre":
        valA = aReq.nombre;
        valB = bReq.nombre;
        break;
      case "descripcion":
        valA = aReq.descripcion;
        valB = bReq.descripcion;
        break;
      case "prioridad":
        valA = prioridadOrden.indexOf(aReq.prioridad);
        valB = prioridadOrden.indexOf(bReq.prioridad);
        break;
      case "estadoRevision":
        valA = aReq.estadoRevision;
        valB = bReq.estadoRevision;
        break;
      case "version":
        valA = aReq.version;
        valB = bReq.version;
        break;
      default:
        return 0;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const allSelected = seleccionables.every((r) => selected.includes(r.documentId));
  const someSelected = seleccionables.some((r) => selected.includes(r.documentId)) && !allSelected;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const ids = seleccionables.map((r) => r.documentId);
    onToggleAll(ids, checked);
  };

  const toggleSort = (column: ColumnKey) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const renderHeader = (label: string, key: ColumnKey, width: string) => (
    <TableCell sx={{ width }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {label}
        <Tooltip title={`Ordenar por ${label}`}>
          <IconButton size="small" onClick={() => toggleSort(key)} sx={{ borderRadius: 1, p: 0.2 }}>
            {sortColumn === key ? (
              sortOrder === "asc" ? (
                <ArrowDropUp fontSize="small" />
              ) : (
                <ArrowDropDown fontSize="small" />
              )
            ) : (
              <UnfoldMore fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </TableCell>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleToggleAll}
                />
              </TableCell>
              {renderHeader("Identificador", "identificador", "10%")}
              {renderHeader("Nombre", "nombre", "15%")}
              {renderHeader("Descripción", "descripcion", "30%")}
              {renderHeader("Prioridad", "prioridad", "10%")}
              {renderHeader("Versión", "version", "10%")}
              {renderHeader("Estado", "estadoRevision", "15%")}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hay requisitos disponibles
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((req) => {
                const estado = req.requisito?.[0]?.estadoRevision;
                const deshabilitado = estado === "VALIDADO";

                return (
                  <TableRow
                    key={req.documentId}
                    sx={deshabilitado ? { opacity: 0.5, pointerEvents: "none" } : {}}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        disabled={deshabilitado}
                        checked={selected.includes(req.documentId)}
                        onChange={() => onToggle(req.documentId)}
                      />
                    </TableCell>
                    <TableCell>{req.identificador ?? "Sin ID"}</TableCell>
                    <TableCell>{req.requisito?.[0]?.nombre ?? "Sin nombre"}</TableCell>
                    <TableCell>{req.requisito?.[0]?.descripcion ?? "Sin descripción"}</TableCell>
                    <TableCell>
                      <Chip
                        label={req.requisito?.[0]?.prioridad ?? "Sin prioridad"}
                        color={
                          req.requisito?.[0]?.prioridad === "ALTA"
                            ? "error"
                            : req.requisito?.[0]?.prioridad === "MEDIA"
                              ? "warning"
                              : "info"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{req.requisito?.[0]?.version}.0</TableCell>
                    <TableCell>
                      <Chip
                        label={estado ?? "Desconocido"}
                        color={
                          estado === "VALIDADO"
                            ? "success"
                            : estado === "AMBIGUO"
                              ? "warning"
                              : estado === "NO_AMBIGUO"
                                ? "info"
                                : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
