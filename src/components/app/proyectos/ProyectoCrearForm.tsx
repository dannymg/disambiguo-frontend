import {
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import ProyectoCrearKeywords from "./ProyectoCrearKeywords";

interface Props {
  titulo: string;
  descripcion: string;
  objetivo: string;
  contexto: string;
  palabrasClave: string[];
  newKeyword: string;
  error: string | null;
  loading: boolean;
  onChangeTitulo: (val: string) => void;
  onChangeDescripcion: (val: string) => void;
  onChangeObjetivo: (val: string) => void;
  onChangeContexto: (val: string) => void;
  onChangeNewKeyword: (val: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProjectForm({
  titulo,
  descripcion,
  objetivo,
  contexto,
  palabrasClave,
  newKeyword,
  error,
  loading,
  onChangeTitulo,
  onChangeDescripcion,
  onChangeObjetivo,
  onChangeContexto,
  onChangeNewKeyword,
  onAddKeyword,
  onRemoveKeyword,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
      <TextField
        fullWidth label="Título" margin="normal" required
        value={titulo} onChange={(e) => onChangeTitulo(e.target.value)}
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
        placeholder="Relacionar con la Problemática y Pregunta de Investigación: ¿Por qué se construye el sistema?"
        helperText="Ejemplo: El sistema busca facilitar la gestión de inventario y ventas en farmacias, a través de..."
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
        placeholder="Información del dominio del sistema: ¿En qué entorno se usará? ¿Quiénes son los usuarios? ¿En qué tipo de organización se implementará?"
        helperText="Ejemplo: El sistema se centra en la venta de productos. Operará en una cadena de farmacias en zonas rurales con conectividad intermitente. Los usuarios son personal sin experiencia técnica..."
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

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Box>
    </Box>
  );
}
