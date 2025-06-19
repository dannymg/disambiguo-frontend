// CorreccionesGeneradasPage.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useParams } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loading from "@/components/common/Dialogs/Loading";
import { requisitoService } from "@/api/requisitoService";
import type { CorreccionSimulada } from "@/types/entities";
import { Check, Edit } from "@mui/icons-material";

export default function CorreccionesGeneradasPage() {
  const searchParams = useSearchParams();
  const { proyectoId } = useParams() as { proyectoId: string };
  const seleccionIds = useMemo(() => searchParams.get("seleccion")?.split(",") ?? [], [searchParams]);

  const [correcciones, setCorrecciones] = useState<CorreccionSimulada[]>([]);
  const [loading, setLoading] = useState(true);
  const [seleccionadas, setSeleccionadas] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCorrecciones = async () => {
      try {
        const data = await requisitoService.generarCorrecciones(proyectoId, seleccionIds);
        setCorrecciones(data);
      } catch (err) {
        console.error("❌ Error al generar correcciones:", err);
      } finally {
        setLoading(false);
      }
    };

    if (seleccionIds.length > 0) {
      fetchCorrecciones();
    } else {
      setLoading(false);
    }
  }, [proyectoId, seleccionIds]);

  const handleSeleccionar = (reqId: string, index: number) => {
    setSeleccionadas((prev) => ({ ...prev, [reqId]: index }));
  };

  const handleModificar = (reqId: string, index: number) => {
    console.log(`✏️ Modificar texto de la corrección ${index + 1} del requisito ${reqId}`);
  };

  const handleGuardar = (id: string) => console.log(`✅ Guardado: ${id}`);
  const handleDescartar = (id: string) => console.log(`❌ Descartado: ${id}`);

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Correcciones generadas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          A continuación se presentan las correcciones generadas. Seleccione la más adecuada.
        </Typography>

        {correcciones.length === 0 ? (
          <Typography>No se generaron correcciones.</Typography>
        ) : (
          correcciones.map((item) => (
            <Paper key={item.requisitoId} sx={{ my: 4, p: 3 }}>
              <Typography fontWeight="bold">{item.identificador}</Typography>
              <Typography variant="body2">{item.descripcion}</Typography>

              <Box sx={{ display: "flex", gap: 4, my: 2 }}>
                <Box sx={{ background: "#d7eafc", p: 2, borderRadius: 2, width: "30%" }}>
                  <Typography variant="subtitle2">Tipo de ambigüedad</Typography>
                  <Typography>{item.tipoAmbiguedad}</Typography>
                </Box>
                <Box sx={{ background: "#d7eafc", p: 2, borderRadius: 2, width: "70%" }}>
                  <Typography variant="subtitle2">Explicación</Typography>
                  <Typography>{item.explicacion}</Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {item.correcciones.map((c, i) => {
                  const isSelected = seleccionadas[item.requisitoId] === i;
                  return (
                    <Grid item xs={12} sm={4} key={i}>
                      <Card
                        onClick={() => handleSeleccionar(item.requisitoId, i)}
                        sx={{
                          backgroundColor: isSelected ? "#d0f0d0" : "#f5f5f5",
                          cursor: "pointer",
                          boxShadow: isSelected ? 6 : 1,
                          transition: "all 0.3s",
                          '&:hover': {
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardContent>
                          <Typography fontWeight="bold">Corrección {i + 1}</Typography>
                          <Typography>{c.texto}</Typography>
                          <Box mt={2} display="flex" justifyContent="space-between">
                            <Button size="small" variant="outlined" onClick={() => handleSeleccionar(item.requisitoId, i)}>
                              <Check fontSize="small" sx={{ mr: 1 }} /> Seleccionar
                            </Button>
                            <Button size="small" variant="outlined" onClick={() => handleModificar(item.requisitoId, i)}>
                              <Edit fontSize="small" sx={{ mr: 1 }} /> Modificar
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="error" onClick={() => handleDescartar(item.requisitoId)}>
                  Descartar y siguiente
                </Button>
                <Button variant="contained" color="success" onClick={() => handleGuardar(item.requisitoId)}>
                  Guardar y siguiente
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Container>
    </DashboardLayout>
  );
}
