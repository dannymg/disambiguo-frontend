import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useRequisitoForm } from '@/hooks/requisitos/useRequisitoForm';
import NoticeDialog from '@/components/common/Dialogs/NoticeDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  proyectoId: string;
  modo: 'crear' | 'editar';
  initialValues?: any;
  onSuccess: () => void;
}

const prioridades = [
  { value: 'ALTA', label: 'ALTA', sx: { backgroundColor: 'rgba(255,0,0,0.3)' } },
  { value: 'MEDIA', label: 'MEDIA', sx: { backgroundColor: 'rgba(255,255,0,0.3)' } },
  { value: 'BAJA', label: 'BAJA', sx: { backgroundColor: 'rgba(0,255,0,0.3)' } },
];

export default function RequisitoForm({
  open,
  onClose,
  proyectoId,
  modo,
  initialValues,
  onSuccess,
}: Props) {
  const form = useRequisitoForm({
    modo,
    proyectoId,
    initialValues,
    onSuccess,
  });

  const handleClose = () => {
    form.resetForm();
    onClose();
  };

  const prefix = form.formData.tipo === 'FUNCIONAL' ? 'RF-' : 'RNF-';

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{modo === 'crear' ? 'Crear Requisito' : 'Editar Requisito'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">{prefix}</Typography>
                <TextField
                  margin="normal"
                  required
                  label="Número ID"
                  name="numeroID"
                  value={form.formData.numeroID}
                  onChange={form.handleChange}
                  onBlur={form.handleNumeroIDBlur}
                  error={Boolean(form.error)}
                  helperText={form.error}
                  inputProps={{
                    maxLength: 3,
                    pattern: '[0-9]*',
                    inputMode: 'numeric',
                  }}
                  placeholder="000"
                  disabled={modo === 'editar'}
                />
            </Box>

            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Tipo</FormLabel>
                <RadioGroup
                  row
                  name="tipo"
                  value={form.formData.tipo}
                  onChange={form.handleChange}
                >
                  <FormControlLabel
                    value="FUNCIONAL"
                    control={<Radio />}
                    label="FUNCIONAL"
                    disabled={modo === 'editar'}
                  />
                  <FormControlLabel
                    value="NO_FUNCIONAL"
                    control={<Radio />}
                    label="NO FUNCIONAL"
                    disabled={modo === 'editar'} 
                  />
                </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              margin="normal"
              value={form.formData.nombre}
              onChange={form.handleChange}
              placeholder="Nombre del requisito"
              required
            />

            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              margin="normal"
              value={form.formData.descripcion}
              onChange={form.handleChange}
              placeholder="Descripción del requisito"
              multiline
              rows={4}
              required
            />

            <TextField
              select
              fullWidth
              label="Prioridad"
              margin="normal"
              name="prioridad"
              value={form.formData.prioridad}
              onChange={form.handleChange}
              required
              sx={{
                backgroundColor:
                  prioridades.find((p) => p.value === form.formData.prioridad)?.sx.backgroundColor,
              }}
            >
              {prioridades.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={option.sx}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
              <Button variant="contained" type="submit" disabled={form.loading}>
                {form.loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <NoticeDialog
        open={form.noticeOpen}
        onClose={() => form.setNoticeOpen(false)}
        title={form.noticeType === 'success' ? 'Éxito' : 'Error'}
        message={form.noticeType === 'success' ? form.successMessage : form.errorMessage}
        type={form.noticeType}
      />
    </>
  );
}
