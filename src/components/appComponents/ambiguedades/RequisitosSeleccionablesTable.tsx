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
} from "@mui/material";
import { VersionRequisito } from "@/types";
import SortableHeaderCell from "@/components/appComponents/shared/table/SortableHeaderCell";
import RequisitosSeleccionablesRow from "./RequisitosSeleccionablesRow";
import { useRequisitosSeleccionablesSort } from "@/hooks/ambiguedades";

interface Props {
  title: string;
  data: VersionRequisito[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
}

export default function RequisitosSeleccionablesTable({
  title,
  data,
  selected,
  onToggle,
  onToggleAll,
}: Props) {
  const { seleccionables, sortedData, sortColumn, sortOrder, toggleSort } =
    useRequisitosSeleccionablesSort(data);

  const allSelected = seleccionables.every((r) => selected.includes(r.documentId));
  const someSelected = seleccionables.some((r) => selected.includes(r.documentId)) && !allSelected;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const ids = seleccionables.map((r) => r.documentId);
    onToggleAll(ids, checked);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 1 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-root": { fontWeight: 600 } }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <SortableHeaderCell
                label="Identificador"
                columnKey="identificador"
                width="10%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
              />
              <SortableHeaderCell
                label="Nombre"
                columnKey="nombre"
                width="15%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
              />
              <SortableHeaderCell
                label="Descripción"
                columnKey="descripcion"
                width="30%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
              />
              <SortableHeaderCell
                label="Prioridad"
                columnKey="prioridad"
                width="10%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
              />
              <SortableHeaderCell
                label="Versión"
                columnKey="version"
                width="10%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
              />
              <SortableHeaderCell
                label="Estado"
                columnKey="estadoRevision"
                width="15%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
              />
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
              sortedData.map((req) => (
                <RequisitosSeleccionablesRow
                  key={req.documentId}
                  req={req}
                  selected={selected.includes(req.documentId)}
                  onToggle={onToggle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
