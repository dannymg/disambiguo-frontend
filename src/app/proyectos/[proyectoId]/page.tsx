'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Layers as LayersIcon } from "@mui/icons-material";
import { proyectoService } from '@/api/proyecto-service';
import { Proyecto, VersionRequisito } from '@/types/entities';
import Loading from '@/components/common/Loading';
import DashboardLayout from '@/components/common/DashBoardLayout';
import { useAuth } from '@/hooks/auth/auth-context';
import { useParams } from 'next/navigation';

export default function ProyectoPage() {
  const { proyectoId } = useParams() as { proyectoId: string };
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [requisitos, setRequisitos] = useState<VersionRequisito[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAnalista } = useAuth();

  useEffect(() => {
    const fetchProyecto = async () => {
      if (!proyectoId) return;
      try {
        setLoading(true);
        const proyectoData = await proyectoService.getProyectoById(proyectoId);
        setProyecto(proyectoData);
        setRequisitos(proyectoData.listaRequisitos || []);
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProyecto();
  }, [proyectoId]);

  const handleCreateRequisito = () => {
    router.push(`/proyectos/${proyectoId}/requisitos/crear`);
  };

  const handleEditRequisito = (requisitoId: number) => {
    router.push(`/proyectos/${proyectoId}/requisitos/${requisitoId}/editar`);
  };

  const handleDeleteRequisito = async (requisitoId: number) => {
    if (confirm("¿Estás seguro de eliminar este requisito?")) {
      try {
        setRequisitos(requisitos.filter((req) => req.id !== requisitoId));
      } catch (error) {
        console.error("Error al eliminar requisito:", error);
      }
    }
  };

  if (loading) return <Loading />;
  if (!proyecto) return <Typography>Proyecto no encontrado</Typography>;

  // Dividir requisitos en RF y RNF
  const requisitosFuncionales = requisitos
  .filter(req => req.identificador?.startsWith("RF") && req.identificador !== undefined);

const requisitosNoFuncionales = requisitos
  .filter(req => req.identificador?.startsWith("RNF") && req.identificador !== undefined);
  
  return (
    <DashboardLayout>
      <Container
        maxWidth="xl" // Ampliamos el contenedor para aprovechar más espacio
        sx={{
          mt: 4,
          mb: 4,
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            bgcolor: (theme) => theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {proyecto.titulo}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {proyecto.descripcion}
          </Typography>
          {proyecto.contexto && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              {proyecto.contexto}
            </Typography>
          )}
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Listado de requisitos</Typography>
            {isAnalista && (
              <Button variant="contained" color="primary" onClick={handleCreateRequisito}>
                Crear requisito
              </Button>
            )}
          </Box>

          {/* Tabla de Requisitos Funcionales */}
          <Typography variant="h6" sx={{ mb: 2 }}>Requisitos Funcionales (RF)</Typography>
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              mb: 4,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>Identificador</TableCell>
                  <TableCell sx={{ width: "15%" }}>Nombre</TableCell>
                  <TableCell sx={{ width: "40%" }}>Descripción</TableCell>
                  <TableCell sx={{ width: "10%" }}>Prioridad</TableCell>
                  <TableCell sx={{ width: "10%" }}>Estado de revisión</TableCell>
                  <TableCell sx={{ width: "5%" }}>Versión</TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisitosFuncionales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay requisitos funcionales
                    </TableCell>
                  </TableRow>
                ) : (
                  requisitosFuncionales.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.identificador}</TableCell>
                      <TableCell>{req.requisito?.[0]?.nombre}</TableCell>
                      <TableCell>{req.requisito?.[0]?.descripcion}</TableCell>
                      <TableCell>
                        <Chip
                          label={req.requisito?.[0]?.prioridad}
                          color={
                            req.requisito?.[0]?.prioridad === "ALTA"
                              ? "error"
                              : req.requisito?.[0]?.prioridad === "MEDIA"
                              ? "warning"
                              : "info"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={req.requisito?.[0]?.estadoRevision}
                          color={req.requisito?.[0]?.estadoRevision === "PENDIENTE" ? "warning" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{req.requisito?.[0]?.version}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEditRequisito(req.id)} disabled={!isAnalista}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteRequisito(req.id)} disabled={!isAnalista}>
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

          {/* Tabla de Requisitos No Funcionales */}
          <Typography variant="h6" sx={{ mb: 2 }}>Requisitos No Funcionales (RNF)</Typography>
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>Identificador</TableCell>
                  <TableCell sx={{ width: "15%" }}>Nombre</TableCell>
                  <TableCell sx={{ width: "40%" }}>Descripción</TableCell>
                  <TableCell sx={{ width: "10%" }}>Prioridad</TableCell>
                  <TableCell sx={{ width: "10%" }}>Estado de revisión</TableCell>
                  <TableCell sx={{ width: "5%" }}>Versión</TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisitosNoFuncionales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay requisitos no funcionales
                    </TableCell>
                  </TableRow>
                ) : (
                  requisitosNoFuncionales.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.identificador}</TableCell>
                      <TableCell>{req.requisito?.[0]?.nombre}</TableCell>
                      <TableCell>{req.requisito?.[0]?.descripcion}</TableCell>
                      <TableCell>
                        <Chip
                          label={req.requisito?.[0]?.prioridad}
                          color={
                            req.requisito?.[0]?.prioridad === "ALTA"
                              ? "error"
                              : req.requisito?.[0]?.prioridad === "MEDIA"
                              ? "warning"
                              : "info"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={req.requisito?.[0]?.estadoRevision}
                          color={req.requisito?.[0]?.estadoRevision === "PENDIENTE" ? "warning" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{req.requisito?.[0]?.version}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEditRequisito(req.id)} disabled={!isAnalista}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteRequisito(req.id)} disabled={!isAnalista}>
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
      </Container>
    </DashboardLayout>
  );
}