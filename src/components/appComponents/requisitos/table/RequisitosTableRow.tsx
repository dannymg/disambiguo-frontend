"use client";

import { Checkbox, TableCell, TableRow } from "@mui/material";
import { VersionRequisito } from "@/types";
import RequisitoTableAcciones from "../RequisitoTableAcciones";
import EstadoChip from "@/components/appComponents/shared/table/EstadoChip";
import PrioridadChip from "@/components/appComponents/shared/table/PrioridadChip";

interface Props {
  req: VersionRequisito;
  selected: boolean;
  isAnalista: boolean;
  onToggle: (documentId: string) => void;
  onEdit: (requisito: VersionRequisito) => void;
  onDelete: (requisito: VersionRequisito) => void;
  onChangeVersion: (requisito: VersionRequisito) => void;
}

export default function RequisitosTableRow({
  req,
  selected,
  isAnalista,
  onToggle,
  onEdit,
  onDelete,
  onChangeVersion,
}: Props) {
  const requisito = req.requisito?.[0];

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={() => onToggle(req.documentId)} />
      </TableCell>

      <TableCell>{req.identificador ?? "Sin ID"}</TableCell>

      <TableCell sx={{ wordBreak: "break-word" }}>{requisito?.nombre ?? "Sin nombre"}</TableCell>

      <TableCell sx={{ wordBreak: "break-word" }}>
        {requisito?.descripcion ?? "Sin descripción"}
      </TableCell>

      <TableCell>
        <PrioridadChip prioridad={requisito?.prioridad} />
      </TableCell>

      <TableCell>
        <EstadoChip estado={requisito?.estadoRevision} />
      </TableCell>

      <TableCell>{requisito?.version ?? 0}.0</TableCell>

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
  );
}
