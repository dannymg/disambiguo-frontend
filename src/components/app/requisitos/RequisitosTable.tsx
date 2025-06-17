import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';
import { VersionRequisito } from '@/types/entities';

interface Props {
  title: string;
  data: VersionRequisito[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isAnalista: boolean;
}

export default function RequisitosTable({
  title,
  data,
  onEdit,
  onDelete,
  isAnalista,
}: Props) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "10%", overflowWrap: "break-word" }}>Identificador</TableCell>
              <TableCell sx={{ width: "15%", overflowWrap: "break-word" }}>Nombre</TableCell>
              <TableCell sx={{ width: "35%", overflowWrap: "break-word" }}>Descripción</TableCell>
              <TableCell sx={{ width: "10%" }}>Prioridad</TableCell>
              <TableCell sx={{ width: "10%" }}>Revisión</TableCell>
              <TableCell sx={{ width: "5%" }}>Versión</TableCell>
              <TableCell align="center" sx={{ width: "15%" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay datos
                </TableCell>
              </TableRow>
            ) : (
              data.map((req) => (
                <TableRow key={req.documentId}>
                  <TableCell>{req.identificador}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>
                    {req.requisito?.[0]?.nombre}
                  </TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>
                    {req.requisito?.[0]?.descripcion}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={req.requisito?.[0]?.prioridad}
                      color={
                        req.requisito?.[0]?.prioridad === 'ALTA'
                          ? 'error'
                          : req.requisito?.[0]?.prioridad === 'MEDIA'
                          ? 'warning'
                          : 'info'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={req.requisito?.[0]?.estadoRevision}
                      color={
                        req.requisito?.[0]?.estadoRevision === 'PENDIENTE'
                          ? 'warning'
                          : 'success'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{req.requisito?.[0]?.version}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => onEdit(req.id)} disabled={!isAnalista}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(req.id)} disabled={!isAnalista}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton>
                      <LayersIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
