'use client';

import { IconButton, Tooltip } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';

import { VersionRequisito } from '@/types/entities';

interface Props {
  requisito: VersionRequisito;
  isAnalista: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onChangeVersion: () => void;
}

export default function RequisitoTableAcciones({
  requisito,
  isAnalista,
  onEdit,
  onDelete,
  onChangeVersion,
}: Props) {
  return (
    <>
      <Tooltip title="Editar" arrow>
        <span>
          <IconButton onClick={onEdit} disabled={!isAnalista}>
            <EditIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Eliminar" arrow>
        <span>
          <IconButton onClick={onDelete} disabled={!isAnalista}>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Cambiar versión activa" arrow>
        <span>
          <IconButton onClick={onChangeVersion} disabled={!isAnalista}>
            <LayersIcon />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}
