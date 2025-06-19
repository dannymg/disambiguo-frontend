import { useState } from 'react';
import dynamic from 'next/dynamic';
import Papa, { ParseResult } from 'papaparse';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Alert,
  Paper,
  Divider,
  Input,
} from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';
import { RequisitoPreview } from '@/hooks/requisitos/useRequisitoPreview';

const RequisitosPreview = dynamic(() => import('./RequisitosPreview'), { ssr: false });

interface Props {
  open: boolean;
  onClose: () => void;
  proyectoId: string;
  onSuccess: (cantidad: number) => void;
}

interface CsvRequisitoRaw {
  identificador: string;
  nombre: string;
  descripcion: string;
  prioridad: string;
}

export default function RequisitoSubirDialog({
  open,
  onClose,
  proyectoId,
  onSuccess,
}: Props) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<RequisitoPreview[] | null>(null);

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== 'text/csv') {
      setError('Solo se permiten archivos .csv');
      setArchivo(null);
      return;
    }
    setArchivo(file);
    setError(null);
  };

  const parsearArchivo = () => {
    if (!archivo) {
      setError('Debes seleccionar un archivo .csv válido');
      return;
    }

    Papa.parse<CsvRequisitoRaw>(archivo, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CsvRequisitoRaw>) => {
        const datos = results.data;
        const requisitosTransformados: RequisitoPreview[] = [];

        for (const item of datos) {
          const match = item.identificador?.match(/^(RF|RNF)-(\d{3})$/i);
          if (!match) continue;

          const tipo = match[1].toUpperCase() === 'RF' ? 'FUNCIONAL' : 'NO_FUNCIONAL';
          const numeroID = match[2];

          requisitosTransformados.push({
            tipo,
            numeroID,
            nombre: item.nombre?.trim() || '',
            descripcion: item.descripcion?.trim() || '',
            prioridad: item.prioridad?.toUpperCase() as 'ALTA' | 'MEDIA' | 'BAJA',
            seleccionado: true,
          });
        }

        if (requisitosTransformados.length === 0) {
          setError('No se encontraron requisitos válidos en el archivo.');
        } else {
          setPreviewData(requisitosTransformados);
        }
      },
      error: (err) => {
        setError('Error al leer el archivo: ' + err.message);
      },
    });
  };

  return (
    <>
      <Dialog open={open && !previewData} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cargar requisitos desde archivo CSV</DialogTitle>
        <DialogContent dividers>
          <Paper variant="outlined" sx={{ p: 3, mb: 2, bgcolor: 'grey.50' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <UploadFileIcon fontSize="large" color="primary" />
              <Stack>
                <Typography variant="body1" fontWeight="bold">
                  Selecciona un archivo .CSV
                </Typography>
                <Input
                  type="file"
                  inputProps={{ accept: '.csv' }}
                  onChange={handleArchivoChange}
                  fullWidth
                />
              </Stack>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              El archivo debe incluir las columnas:
              <br />
              <strong>identificador</strong> (ej. RF-001), <strong>nombre</strong>,
              <strong> descripción</strong> y <strong>prioridad</strong> (ALTA, MEDIA, BAJA).
            </Typography>
          </Paper>

          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={parsearArchivo} variant="contained" disabled={!archivo}>
            Previsualizar
          </Button>
        </DialogActions>
      </Dialog>

      {previewData && (
        <RequisitosPreview
          open={!!previewData}
          onClose={() => {
            setPreviewData(null);
            setArchivo(null);
            setError(null);
          }}
          proyectoId={proyectoId}
          requisitosCsv={previewData}
          onSuccess={(cantidad) => {
            onSuccess(cantidad);
            setPreviewData(null);
            setArchivo(null);
            setError(null);
          }}
        />
      )}
    </>
  );
}
