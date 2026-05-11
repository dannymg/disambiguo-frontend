"use client";

import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Paper } from "@mui/material";
import { RequisitoPreview } from "@/hooks/requisitos";
import RequisitoPreviewRow from "../RequisitoPreviewRow";

interface Props {
  requisitos: RequisitoPreview[];
  errores: Record<number, string>;
  todosSeleccionados: boolean;
  algunoSeleccionado: boolean;
  onToggleTodos: () => void;
  onChangeCampo: (index: number, campo: keyof RequisitoPreview, valor: string | boolean) => void;
  onToggleSeleccionado: (index: number) => void;
}

export default function RequisitosPreviewTable({
  requisitos,
  errores,
  todosSeleccionados,
  algunoSeleccionado,
  onToggleTodos,
  onChangeCampo,
  onToggleSeleccionado,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ overflow: "auto", maxHeight: 500, borderRadius: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={todosSeleccionados}
                indeterminate={!todosSeleccionados && algunoSeleccionado}
                onChange={onToggleTodos}
              />
            </TableCell>
            <TableCell>
              <strong>Tipo</strong>
            </TableCell>
            <TableCell>
              <strong>Numero ID</strong>
            </TableCell>
            <TableCell>
              <strong>Nombre</strong>
            </TableCell>
            <TableCell>
              <strong>Descripcion</strong>
            </TableCell>
            <TableCell>
              <strong>Prioridad</strong>
            </TableCell>
            <TableCell>
              <strong>Error</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requisitos.map((r, i) => (
            <RequisitoPreviewRow
              key={i}
              r={r}
              index={i}
              error={errores[i]}
              onChangeCampo={onChangeCampo}
              onToggleSeleccionado={onToggleSeleccionado}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
