'use client'

import { useForm } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Box, 
  FormControlLabel, 
  Switch,
  Alert
} from '@mui/material';
import { Proyecto } from '@/types/entities';

interface ProjectFormProps {
  onSubmit: (data: Partial<Proyecto>) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<Proyecto>;
}

export default function ProjectForm({ onSubmit, loading = false, initialData }: ProjectFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Proyecto>>({
    defaultValues: initialData || {
      titulo: '',
      descripcion: '',
      contexto: '',
      version: 1,
      esActivo: true,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          label="Título del Proyecto"
          fullWidth
          error={!!errors.titulo}
          helperText={errors.titulo?.message}
          {...register('titulo', { required: 'El título es requerido' })}
        />

        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={3}
          error={!!errors.descripcion}
          helperText={errors.descripcion?.message}
          {...register('descripcion', { required: 'La descripción es requerida' })}
        />

        <TextField
          label="Contexto"
          fullWidth
          multiline
          rows={3}
          error={!!errors.contexto}
          helperText={errors.contexto?.message}
          {...register('contexto', { required: 'El contexto es requerido' })}
        />

        <TextField
          label="Versión"
          type="number"
          fullWidth
          error={!!errors.version}
          helperText={errors.version?.message}
          {...register('version', { 
            required: 'La versión es requerida',
            min: { value: 1, message: 'La versión debe ser mayor a 0' }
          })}
        />

        <FormControlLabel
          control={
            <Switch 
              {...register('esActivo')}
              defaultChecked 
            />
          }
          label="Proyecto Activo"
        />

        {errors.root && (
          <Alert severity="error">
            {errors.root.message}
          </Alert>
        )}

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Proyecto'}
          </Button>
        </Box>
      </Box>
    </form>
  );
}

