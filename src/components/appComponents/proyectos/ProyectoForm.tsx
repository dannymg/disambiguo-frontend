"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import ProyectoCrearKeywords from "./ProyectoCrearKeywords";
import { Proyecto } from "@/types";
import { useProyectoForm } from "@/hooks/proyectos";

interface Props {
  modo: "crear" | "editar";
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialValues?: Proyecto;
}

export default function ProyectoFormulario({
  modo,
  open,
  onClose,
  onSuccess,
  initialValues,
}: Props) {
  const {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    objetivo,
    setObjetivo,
    contexto,
    setContexto,
    palabrasClave,
    newKeyword,
    setNewKeyword,
    loading,
    error,
    handleAddKeyword,
    handleRemoveKeyword,
    handleSubmit,
  } = useProyectoForm({ initialValues, onSuccess });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {modo === "crear" ? "Crear proyecto" : "Editar proyecto"}
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* 🔹 SECCIÓN GENERAL */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Información general
              </Typography>

              <TextField
                fullWidth
                label="Título"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ejemplo: Sistema de gestión de farmacias"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={2}
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve descripción del sistema"
              />
            </Box>

            <Divider />

            {/* 🔹 SECCIÓN DETALLE */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Detalle del sistema
              </Typography>

              <TextField
                fullWidth
                label="Objetivo"
                multiline
                rows={2}
                required
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                placeholder="¿Qué problema resuelve el sistema?"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Contexto"
                multiline
                rows={4}
                required
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="¿Dónde y por quién será utilizado?"
              />
            </Box>

            <Divider />

            {/* 🔹 KEYWORDS */}
            <ProyectoCrearKeywords
              keywords={palabrasClave}
              newKeyword={newKeyword}
              onChangeNewKeyword={setNewKeyword}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={handleRemoveKeyword}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            px: 4,
            borderRadius: 2,
          }}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
