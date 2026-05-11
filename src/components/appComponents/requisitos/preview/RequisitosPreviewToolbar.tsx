"use client";

import { Button, CircularProgress, Stack } from "@mui/material";
import { FactCheck as FactCheckIcon } from "@mui/icons-material";

interface Props {
  loadingValidacion: boolean;
  onValidarTodos: () => void;
}

export default function RequisitosPreviewToolbar({ loadingValidacion, onValidarTodos }: Props) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
      <Button
        onClick={onValidarTodos}
        variant="outlined"
        startIcon={<FactCheckIcon />}
        disabled={loadingValidacion}>
        {loadingValidacion ? <CircularProgress size={18} /> : "Validar requisitos"}
      </Button>
    </Stack>
  );
}
