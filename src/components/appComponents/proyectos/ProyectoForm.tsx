import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import ProyectoCrearKeywords from "./ProyectoCrearKeywords";
import { Proyecto } from "@/types/entities";
import { useProyectoForm } from "@/hooks/proyectos/useProyectoForm";

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
      <DialogTitle>{modo === "crear" ? "Crear nuevo proyecto" : "Editar proyecto"}</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Título"
            margin="normal"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título descriptivo del proyecto"
            helperText="Ejemplo: Sistema de gestión de farmacias"
          />
          <TextField
            fullWidth
            label="Descripción corta"
            margin="normal"
            multiline
            rows={2}
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Breve descripción del sistema"
            helperText="Ejemplo: Gestión de inventario y ventas de farmacias"
          />
          <TextField
            fullWidth
            label="Objetivo del sistema"
            margin="normal"
            multiline
            rows={2}
            required
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder="¿Qué problema resuelve el sistema?"
          />
          <TextField
            fullWidth
            label="Contexto del sistema"
            margin="normal"
            multiline
            rows={4}
            required
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="¿Dónde y por quién será utilizado?"
          />

          <ProyectoCrearKeywords
            keywords={palabrasClave}
            newKeyword={newKeyword}
            onChangeNewKeyword={setNewKeyword}
            onAddKeyword={handleAddKeyword}
            onRemoveKeyword={handleRemoveKeyword}
          />

          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
