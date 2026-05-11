"use client";

import { Checkbox, TableCell, TableRow, Tooltip } from "@mui/material";
import { VersionRequisito } from "@/types";
import EstadoChip from "@/components/appComponents/shared/table/EstadoChip";
import PrioridadChip from "@/components/appComponents/shared/table/PrioridadChip";

interface Props {
  req: VersionRequisito;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function RequisitosSeleccionablesRow({ req, selected, onToggle }: Props) {
  const requisito = req.requisito?.[0];

  const estado = requisito?.estadoRevision;
  const deshabilitado = estado === "VALIDADO";

  const tooltipMessage = deshabilitado
    ? "Este requisito ya ha sido validado y no puede analizarse nuevamente."
    : "";

  const handleToggle = () => {
    if (deshabilitado) return;
    onToggle(req.documentId);
  };

  return (
    <TableRow
      hover={!deshabilitado}
      sx={
        deshabilitado
          ? {
              opacity: 0.5,
              cursor: "not-allowed",
            }
          : {}
      }>
      <TableCell padding="checkbox">
        <Tooltip title={tooltipMessage} arrow>
          <span>
            <Checkbox disabled={deshabilitado} checked={selected} onChange={handleToggle} />
          </span>
        </Tooltip>
      </TableCell>

      <TableCell>{req.identificador ?? "Sin ID"}</TableCell>
      <TableCell>{requisito?.nombre ?? "Sin nombre"}</TableCell>
      <TableCell>{requisito?.descripcion ?? "Sin descripción"}</TableCell>

      <TableCell>
        <PrioridadChip prioridad={requisito?.prioridad} />
      </TableCell>

      <TableCell>{requisito?.version ?? 0}.0</TableCell>

      <TableCell>
        <EstadoChip estado={estado} />
      </TableCell>
    </TableRow>
  );
}
