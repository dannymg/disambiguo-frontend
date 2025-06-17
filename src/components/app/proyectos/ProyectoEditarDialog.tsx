// components/app/proyectos/ProyectoEditarDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import ProyectoCrearKeywords from './ProyectoCrearKeywords';

interface Props {
  open: boolean;
  titulo: string;
  descripcion: string;
  objetivo: string;
  contexto: string;
  palabrasClave: string[];
  newKeyword: string;
  error?: string | null;
  loading?: boolean;
  onClose: () => void;
  onChangeTitulo: (val: string) => void;
  onChangeDescripcion: (val: string) => void;
  onChangeObjetivo: (val: string) => void;
  onChangeContexto: (val: string) => void;
  onChangeNewKeyword: (val: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProyectoEditarDialog({
  open,
  titulo,
  descripcion,
  objetivo,
  contexto,
  palabrasClave,
  newKeyword,
  error = null,
  loading = false,
  onClose,
  onChangeTitulo,
  onChangeDescripcion,
  onChangeObjetivo,
  onChangeContexto,
  onChangeNewKeyword,
  onAddKeyword,
  onRemoveKeyword,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Proyecto</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Título"
            margin="normal"
            required
            value={titulo}
            onChange={(e) => onChangeTitulo(e.target.value)}
            placeholder="Título descriptivo del proyecto"
            helperText="Ejemplo: Sistema de gestión de farmacias"
          />
          <TextField
            fullWidth
            label="Descripción corta"
            placeholder="Breve descripción del proyecto que se va a desarrollar"
            helperText="Ejemplo: Sistema para gestionar inventario y ventas de farmacias."
            margin="normal"
            multiline
            rows={2}
            required
            value={descripcion}
            onChange={(e) => onChangeDescripcion(e.target.value)}
          />
          <TextField
            fullWidth
            label="Objetivo del sistema"
            placeholder="Relacionar con la Problemática y Pregunta de Investigación"
            helperText="Ejemplo: El sistema busca facilitar la gestión de inventario..."
            margin="normal"
            multiline
            rows={2}
            required
            value={objetivo}
            onChange={(e) => onChangeObjetivo(e.target.value)}
          />
          <TextField
            fullWidth
            label="Contexto del sistema"
            placeholder="¿En qué entorno se usará? ¿Quiénes son los usuarios?"
            helperText="Ejemplo: Operará en una cadena de farmacias rurales con conectividad limitada..."
            margin="normal"
            multiline
            rows={4}
            required
            value={contexto}
            onChange={(e) => onChangeContexto(e.target.value)}
          />

          <ProyectoCrearKeywords
            keywords={palabrasClave}
            newKeyword={newKeyword}
            onChangeNewKeyword={onChangeNewKeyword}
            onAddKeyword={onAddKeyword}
            onRemoveKeyword={onRemoveKeyword}
          />

          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          type="submit"
          onClick={onSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
