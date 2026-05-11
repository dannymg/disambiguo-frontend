"use client";

import { Button, Stack } from "@mui/material";

interface Props {
  modoEdicion: boolean;
  esVacio: boolean;
  descripcionGenerada: string;
  onAbrirModoEdicion: () => void;
  onCancelarEdicion: () => void;
  onGuardarEdicion: () => void;
  onRechazar?: () => void;
  onAceptar?: (nuevaDescripcion: string) => void;
}

export default function CorreccionCardAcciones({
  modoEdicion,
  esVacio,
  descripcionGenerada,
  onAbrirModoEdicion,
  onCancelarEdicion,
  onGuardarEdicion,
  onRechazar,
  onAceptar,
}: Props) {
  if (esVacio) return null;

  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
      {!modoEdicion ? (
        <>
          <Button variant="outlined" color="warning" onClick={onAbrirModoEdicion}>
            Modificar
          </Button>
          <Button variant="contained" color="error" onClick={onRechazar}>
            Rechazar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => onAceptar?.(descripcionGenerada)}>
            Aceptar
          </Button>
        </>
      ) : (
        <>
          <Button variant="outlined" color="inherit" onClick={onCancelarEdicion}>
            Cancelar
          </Button>
          <Button variant="contained" color="success" onClick={onGuardarEdicion}>
            Guardar cambio
          </Button>
        </>
      )}
    </Stack>
  );
}
