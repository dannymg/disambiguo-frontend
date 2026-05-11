"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import {
  usePrevisualizacionRequisitos,
  RequisitoPreview,
  useRequisitosPreviewImport,
} from "@/hooks/requisitos";
import { useEffect } from "react";
import { RequisitosPreviewToolbar, RequisitosPreviewTable } from "./preview";

interface Props {
  open: boolean;
  onClose: () => void;
  proyectoId: string;
  requisitosCsv: RequisitoPreview[];
  onSuccess: (cantidad: number) => void;
}

export default function RequisitosPreview({
  open,
  onClose,
  proyectoId,
  requisitosCsv,
  onSuccess,
}: Props) {
  const {
    requisitos,
    errores,
    loadingValidacion,
    actualizarCampo,
    toggleSeleccionado,
    validarTodos,
    validarTodosYRetornarSeleccionadosValidos,
  } = usePrevisualizacionRequisitos(requisitosCsv, proyectoId);

  const { importando, mensaje, error, handleImportar } = useRequisitosPreviewImport(
    proyectoId,
    onSuccess,
    requisitos,
    validarTodos,
    validarTodosYRetornarSeleccionadosValidos
  );

  const todosSeleccionados = requisitos.every((r) => r.seleccionado);
  const algunoSeleccionado = requisitos.some((r) => r.seleccionado);

  const toggleTodos = () => {
    requisitos.forEach((_, i) => actualizarCampo(i, "seleccionado", !todosSeleccionados));
  };

  useEffect(() => {
    if (open) validarTodos();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>Previsualizar requisitos</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Revisa y edita los requisitos antes de importarlos. Selecciona aquellos que deseas
          importar.
        </Typography>

        <RequisitosPreviewToolbar
          loadingValidacion={loadingValidacion}
          onValidarTodos={validarTodos}
        />

        <RequisitosPreviewTable
          requisitos={requisitos}
          errores={errores}
          todosSeleccionados={todosSeleccionados}
          algunoSeleccionado={algunoSeleccionado}
          onToggleTodos={toggleTodos}
          onChangeCampo={actualizarCampo}
          onToggleSeleccionado={toggleSeleccionado}
        />

        {mensaje && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {mensaje}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleImportar}
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={importando}>
          {importando ? "Importando..." : "Importar seleccionados"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
