import {
  TableRow,
  TableCell,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  Alert,
  Typography,
} from "@mui/material";
import { RequisitoPreview } from "@/hooks/requisitos/useRequisitoPreview";
import React from "react";

interface Props {
  r: RequisitoPreview;
  index: number;
  error?: string;
  onChangeCampo: (index: number, campo: keyof RequisitoPreview, valor: string | boolean) => void;
  onToggleSeleccionado: (index: number) => void;
}

const RequisitoPreviewRow = React.memo(function RequisitoPreviewRow({
  r,
  index,
  error,
  onChangeCampo,
  onToggleSeleccionado,
}: Props) {
  return (
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox checked={r.seleccionado} onChange={() => onToggleSeleccionado(index)} />
      </TableCell>
      <TableCell>{r.tipo === "NO_FUNCIONAL" ? "NO FUNCIONAL" : "FUNCIONAL"}</TableCell>
      <TableCell>
        <TextField
          value={r.numeroID}
          onChange={(e) => {
            const valor = e.target.value;
            if (/^\d{0,3}$/.test(valor)) {
              onChangeCampo(index, "numeroID", valor);
            }
          }}
          size="small"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 3 }}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={r.nombre}
          onChange={(e) => onChangeCampo(index, "nombre", e.target.value)}
          size="small"
        />
      </TableCell>
      <TableCell>
        <TextField
          value={r.descripcion}
          onChange={(e) => onChangeCampo(index, "descripcion", e.target.value)}
          size="small"
          multiline
        />
      </TableCell>
      <TableCell>
        <Select
          value={r.prioridad}
          onChange={(e) => onChangeCampo(index, "prioridad", e.target.value)}
          size="small">
          <MenuItem value="ALTA">ALTA</MenuItem>
          <MenuItem value="MEDIA">MEDIA</MenuItem>
          <MenuItem value="BAJA">BAJA</MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
});

export default RequisitoPreviewRow;
