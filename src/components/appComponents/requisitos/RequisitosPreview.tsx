import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import { usePrevisualizacionRequisitos, RequisitoPreview } from '@/hooks/requisitos/useRequisitoPreview';
import { requisitoService } from '@/api/requisitoService';
import { useState, useEffect } from 'react';
import RequisitoPreviewRow from './RequisitoPreviewRow'; // Componente optimizado por fila

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
    obtenerSeleccionadosValidos,
  } = usePrevisualizacionRequisitos(requisitosCsv, proyectoId);

  const [importando, setImportando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validación automática al abrir
  useEffect(() => {
    if (open) {
      validarTodos();
    }
  }, [open]);

  // Lógica para seleccionar todos
  const todosSeleccionados = requisitos.every(r => r.seleccionado);
  const algunoSeleccionado = requisitos.some(r => r.seleccionado);

  const toggleTodos = () => {
    requisitos.forEach((_, i) => actualizarCampo(i, 'seleccionado', !todosSeleccionados));
  };

  const handleImportar = async () => {
    setImportando(true);

    const nuevosErrores = await validarTodos();
    const hayErrores = Object.keys(nuevosErrores).some(i =>
      requisitos[parseInt(i)].seleccionado
    );

    if (hayErrores) {
      setError('Existen errores en los requisitos seleccionados. Corrígelos antes de importar.');
      setMensaje(null);
      setImportando(false);
      return;
    }

    const seleccionados = obtenerSeleccionadosValidos();
    let creados = 0;

    try {
      for (const r of seleccionados) {
        const padded = r.numeroID.padStart(3, '0');
        await requisitoService.createRequisito(
          {
            numeroID: parseInt(r.numeroID),
            tipo: r.tipo,
            nombre: r.nombre.trim(),
            descripcion: r.descripcion.trim(),
            prioridad: r.prioridad,
            version: 1,
            estadoRevision: 'PENDIENTE',
            creadoPor: '',
          },
          proyectoId
        );
        creados++;
      }

      setMensaje(`${creados} requisito(s) importados correctamente.`);
      setError(null);
      onSuccess(creados);
    } catch (err) {
      console.error(err);
      setError('Error al importar los requisitos.');
      setMensaje(null);
    } finally {
      setImportando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>Previsualizar requisitos</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Revisa y edita los requisitos antes de importarlos para evitar IDs duplicados.
          Selecciona aquellos que deseas importar.
        </Typography>

        <Button onClick={validarTodos} variant="outlined" disabled={loadingValidacion} sx={{ mb: 2 }}>
          {loadingValidacion ? <CircularProgress size={18} /> : 'Validar requisitos'}
        </Button>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={todosSeleccionados}
                  indeterminate={!todosSeleccionados && algunoSeleccionado}
                  onChange={toggleTodos}
                />
              </TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Número ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Error</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requisitos.map((r, i) => (
              <RequisitoPreviewRow
                key={i}
                r={r}
                index={i}
                error={errores[i]}
                onChangeCampo={actualizarCampo}
                onToggleSeleccionado={toggleSeleccionado}
              />
            ))}
          </TableBody>
        </Table>

        {mensaje && <Alert severity="success" sx={{ mt: 2 }}>{mensaje}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button
          onClick={handleImportar}
          variant="contained"
          disabled={importando}
        >
          {importando ? 'Importando...' : 'Importar seleccionados'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
