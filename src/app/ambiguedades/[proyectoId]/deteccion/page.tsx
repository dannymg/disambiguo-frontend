"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { requisitoService } from "@/api/requisitoService";
import Loading from "@/components/common/Dialogs/Loading";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Paper
} from "@mui/material";

interface AmbiguedadDetectada {
  documentId: string;
  identificador?: string;
  nombre?: string;
  descripcion?: string;
  ambiguedad: string | null;
  corregir: boolean;
  ambiguedadesPrevias?: unknown[];
}

export default function DeteccionAmbiguedadesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { proyectoId } = useParams() as { proyectoId: string };
  const [requisitos, setRequisitos] = useState<AmbiguedadDetectada[]>([]);
  const [loading, setLoading] = useState(true);

  const requisitosIds = useMemo(
    () => searchParams.get("requisitos")?.split(",") ?? [],
    [searchParams]
  );

  useEffect(() => {
    const fetchAmbiguedades = async () => {
      try {
        const data = await requisitoService.detectarAmbiguedades(proyectoId, requisitosIds);
        console.log("Ambigüedades detectadas:", data);
        setRequisitos(data);
      } catch (error) {
        console.error("Error al detectar ambigüedades:", error);
      } finally {
        setLoading(false);
      }
    };
    if (requisitosIds.length > 0) {
      fetchAmbiguedades();
    } else {
      setLoading(false);
    }
  }, [proyectoId, requisitosIds]);

  const toggleCorregir = (id: string) => {
    setRequisitos((prev) =>
      prev.map((req) => (req.documentId === id ? { ...req, corregir: !req.corregir } : req))
    );
  };

  const generarCorrecciones = () => {
    const seleccionados = requisitos.filter((r) => r.corregir);
    const seleccionIds = seleccionados.map((r) => r.documentId).join(",");
    router.push(`/ambiguedades/${proyectoId}/correccion?seleccion=${seleccionIds}`);
  };

  const cancelarAnalisis = () => {
    router.push("/ambiguedades");
  };

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Analizar ambigüedad
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Resultado del análisis de ambigüedades detectadas automáticamente
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Requisitos con ambigüedades
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Identificador</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Ambigüedad detectada</TableCell>
                  <TableCell>Corregir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisitos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No se detectaron ambigüedades en los requisitos seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  requisitos.map((req) => {
                    const disabled = !req.ambiguedad;
                    return (
                      <TableRow key={req.documentId} sx={disabled ? { opacity: 0.5 } : {}}>
                        <TableCell>{req.identificador ?? "Sin ID"}</TableCell>
                        <TableCell>{req.nombre ?? "Sin nombre"}</TableCell>
                        <TableCell>{req.descripcion ?? "Sin descripción"}</TableCell>
                        <TableCell>{req.ambiguedad ?? "No detectada"}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={req.corregir}
                            disabled={disabled}
                            onChange={() => toggleCorregir(req.documentId)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={cancelarAnalisis}
          >
            Cancelar análisis
          </Button>

          <Button
            variant="contained"
            color="primary"
            disabled={requisitos.filter((r) => r.corregir).length === 0}
            onClick={generarCorrecciones}
          >
            Generar correcciones
          </Button>
        </Box>
      </Container>
    </DashboardLayout>
  );
}
