"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { VersionRequisito } from "@/types";
import SortableHeaderCell from "@/components/appComponents/shared/table/SortableHeaderCell";
import { RequisitosTableRow, RequisitosTableBulkToolbar } from "./table";
import { useRequisitosTableSortAndSelection } from "@/hooks/requisitos";

interface Props {
  title: string;
  data: VersionRequisito[];
  isAnalista: boolean;
  onEdit: (requisito: VersionRequisito) => void;
  onDelete: (requisito: VersionRequisito) => void;
  onChangeVersion: (requisito: VersionRequisito) => void;
  onDeleteMultiple?: (requisitos: VersionRequisito[]) => void;
}

export default function RequisitosTable({
  title,
  data,
  isAnalista,
  onEdit,
  onDelete,
  onChangeVersion,
  onDeleteMultiple,
}: Props) {
  const {
    sortedData,
    sortColumn,
    sortOrder,
    toggleSort,
    selected,
    handleToggle,
    handleToggleAll,
    handleDeleteSelected,
    allSelected,
    someSelected,
  } = useRequisitosTableSortAndSelection(data, onDeleteMultiple);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 1 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-root": { fontWeight: 600 } }}>
              <TableCell padding="checkbox">
                <Tooltip title="Seleccionar todos">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleToggleAll}
                  />
                </Tooltip>
              </TableCell>
              <SortableHeaderCell
                label="Identificador"
                columnKey="identificador"
                width="10%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
                wrapWords
              />
              <SortableHeaderCell
                label="Nombre"
                columnKey="nombre"
                width="15%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
                wrapWords
              />
              <SortableHeaderCell
                label="Descripción"
                columnKey="descripcion"
                width="35%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
                wrapWords
              />
              <SortableHeaderCell
                label="Prioridad"
                columnKey="prioridad"
                width="10%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
                wrapWords
              />
              <SortableHeaderCell
                label="Revisión"
                columnKey="estadoRevision"
                width="10%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
                wrapWords
              />
              <SortableHeaderCell
                label="Versión"
                columnKey="version"
                width="5%"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
                wrapWords
              />
              <TableCell align="center" sx={{ width: "15%" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hay datos
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((req) => (
                <RequisitosTableRow
                  key={req.documentId}
                  req={req}
                  selected={selected.includes(req.documentId)}
                  isAnalista={isAnalista}
                  onToggle={handleToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onChangeVersion={onChangeVersion}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <RequisitosTableBulkToolbar
        disabled={selected.length === 0}
        onDeleteSelected={handleDeleteSelected}
      />
    </Box>
  );
}
