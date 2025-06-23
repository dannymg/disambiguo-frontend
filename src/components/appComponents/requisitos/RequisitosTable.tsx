'use client';

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
  Chip,
  IconButton,
  Tooltip,
  Checkbox,
  Button,
} from '@mui/material';
import {
  ArrowDropUp,
  ArrowDropDown,
  UnfoldMore,
} from '@mui/icons-material';
import { useState } from 'react';
import RequisitoTableAcciones from './RequisitoTableAcciones';
import { VersionRequisito } from '@/types/entities';

interface Props {
  title: string;
  data: VersionRequisito[];
  isAnalista: boolean;
  onEdit: (requisito: VersionRequisito) => void;
  onDelete: (requisito: VersionRequisito) => void;
  onChangeVersion: (requisito: VersionRequisito) => void;
  onDeleteMultiple?: (requisitos: VersionRequisito[]) => void;
}

type SortOrder = 'asc' | 'desc';

type ColumnKey = 'identificador' | 'nombre' | 'descripcion' | 'prioridad' | 'estadoRevision' | 'version';

export default function RequisitosTable({
  title,
  data,
  isAnalista,
  onEdit,
  onDelete,
  onChangeVersion,
  onDeleteMultiple,
}: Props) {
  const [sortColumn, setSortColumn] = useState<ColumnKey>('identificador');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selected, setSelected] = useState<string[]>([]);

  const prioridadOrden = ['ALTA', 'MEDIA', 'BAJA'];

  const sortedData = [...data].sort((a, b) => {
    const aReq = a.requisito?.[0];
    const bReq = b.requisito?.[0];
    if (!aReq || !bReq) return 0;

    let valA: any;
    let valB: any;

    switch (sortColumn) {
      case 'identificador':
        valA = a.identificador;
        valB = b.identificador;
        break;
      case 'nombre':
        valA = aReq.nombre;
        valB = bReq.nombre;
        break;
      case 'descripcion':
        valA = aReq.descripcion;
        valB = bReq.descripcion;
        break;
      case 'prioridad':
        valA = prioridadOrden.indexOf(aReq.prioridad);
        valB = prioridadOrden.indexOf(bReq.prioridad);
        break;
      case 'estadoRevision':
        valA = aReq.estadoRevision;
        valB = bReq.estadoRevision;
        break;
      case 'version':
        valA = aReq.version;
        valB = bReq.version;
        break;
      default:
        return 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (column: ColumnKey) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const allSelected = sortedData.length > 0 && sortedData.every((r) => selected.includes(r.documentId));
  const someSelected = sortedData.some((r) => selected.includes(r.documentId)) && !allSelected;

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const allIds = sortedData.map((r) => r.documentId);
    setSelected(checked ? allIds : []);
  };

  const handleDeleteSelected = () => {
    const itemsToDelete = data.filter((r) => selected.includes(r.documentId));

    if (onDeleteMultiple) {
      onDeleteMultiple(itemsToDelete);
    }

    setSelected([]);
  };

  const renderHeader = (label: string, key: ColumnKey, width: string) => (
    <TableCell sx={{ width, overflowWrap: 'break-word' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {label}
        <Tooltip title={`Ordenar por ${label}`}>
          <IconButton
            size="small"
            onClick={() => toggleSort(key)}
            sx={{ borderRadius: 1, p: 0.2 }}
          >
            {sortColumn === key ? (
              sortOrder === 'asc' ? <ArrowDropUp fontSize="small" /> : <ArrowDropDown fontSize="small" />
            ) : (
              <UnfoldMore fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </TableCell>
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Tooltip title="Seleccionar todos">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleToggleAll}
                  />
                </Tooltip>
              </TableCell>
              {renderHeader('Identificador', 'identificador', '10%')}
              {renderHeader('Nombre', 'nombre', '15%')}
              {renderHeader('Descripción', 'descripcion', '35%')}
              {renderHeader('Prioridad', 'prioridad', '10%')}
              {renderHeader('Revisión', 'estadoRevision', '10%')}
              {renderHeader('Versión', 'version', '5%')}
              <TableCell align="center" sx={{ width: '15%' }}>Acciones</TableCell>
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
                <TableRow key={req.documentId}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(req.documentId)}
                      onChange={() => handleToggle(req.documentId)}
                    />
                  </TableCell>
                  <TableCell>{req.identificador}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>
                    {req.requisito?.[0]?.nombre}
                  </TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>
                    {req.requisito?.[0]?.descripcion}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={req.requisito?.[0]?.prioridad}
                      color={
                        req.requisito?.[0]?.prioridad === 'ALTA'
                          ? 'error'
                          : req.requisito?.[0]?.prioridad === 'MEDIA'
                          ? 'warning'
                          : 'info'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={req.requisito?.[0]?.estadoRevision}
                      color={
                        req.requisito?.[0]?.estadoRevision === 'PENDIENTE'
                          ? 'warning'
                          : 'success'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{req.requisito?.[0]?.version}.0</TableCell>
                  <TableCell align="center">
                    <RequisitoTableAcciones
                      requisito={req}
                      isAnalista={isAnalista}
                      onEdit={() => onEdit(req)}
                      onDelete={() => onDelete(req)}
                      onChangeVersion={() => onChangeVersion(req)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        variant="outlined"
        color="error"
        startIcon={<span>🗑️</span>}
        onClick={handleDeleteSelected}
        disabled={selected.length === 0}
      >
        Eliminar seleccionados
      </Button>
    </Box>
    </Box>
  );
}
