"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Box, Typography, Stack, Button, Paper, Divider } from "@mui/material";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loading from "@/components/common/Dialogs/Loading";
import NoticeDialog from "@/components/common/Dialogs/NoticeDialog";
import AmbiguedadesHeader from "@/components/appComponents/ambiguedades/AmbiguedadesHeader";

import { versionService } from "@/api/versionRequisitoService";
import { requisitoService } from "@/api/requisitoService";

import ValidarCard from "@/components/appComponents/validar/ValidarCard";
import { VersionRequisito } from "@/types";

const CONFIG_SECCIONES = {
  CORREGIDO: {
    titulo: "Requisitos corregidos",
    descripcion: "Requisitos cuya redacción fue aceptada desde la sugerencia del sistema.",
  },
  MODIFICADO: {
    titulo: "Requisitos modificados",
    descripcion: "Requisitos ajustados manualmente por el usuario.",
  },
  NO_AMBIGUO: {
    titulo: "Requisitos sin ambigüedad",
    descripcion: "Requisitos claros que no requirieron cambios.",
  },
} as const;

export default function ValidarPage() {
  const { proyectoId } = useParams() as { proyectoId: string };
  const router = useRouter();

  const [requisitos, setRequisitos] = useState<VersionRequisito[]>([]);
  const [estados, setEstados] = useState<Record<string, "VALIDADO" | "NO_VALIDADO" | null>>({});
  const [loading, setLoading] = useState(true);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await versionService.getAllVersionesYRequisitoActivo(proyectoId);

        const filtrados = data.filter((v) => {
          const estado = v.requisito?.[0]?.estadoRevision;
          return estado && ["CORREGIDO", "MODIFICADO", "NO_AMBIGUO"].includes(estado);
        });

        setRequisitos(filtrados);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [proyectoId]);

  const handleEstado = (id: string, estado: "VALIDADO" | "NO_VALIDADO") => {
    setEstados((prev) => ({
      ...prev,
      [id]: estado,
    }));
  };

  const guardarCambios = async () => {
    const pendientes = requisitos.filter((r) => !estados[r.documentId]);

    if (pendientes.length > 0) {
      setNoticeMessage("Aún hay requisitos sin validar.");
      setNoticeType("error");
      setNoticeOpen(true);
      return;
    }

    try {
      for (const r of requisitos) {
        const estado = estados[r.documentId];

        if (!estado) continue;
        if (!r.identificador) continue;

        await requisitoService.setEstadoRevision(r.identificador, proyectoId, estado);
      }

      setNoticeMessage("Validación completada correctamente.");
      setNoticeType("success");
      setNoticeOpen(true);

      setTimeout(() => router.push("/ambiguedades"), 2000);
    } catch (e) {
      console.error(e);
      setNoticeMessage("Error al guardar.");
      setNoticeType("error");
      setNoticeOpen(true);
    }
  };

  if (loading) return <Loading />;

  const totalValidados = Object.values(estados).filter(Boolean).length;

  const hayRequisitos = requisitos.length > 0;

  return (
    <DashboardLayout>
      <Box sx={{ mt: 4, mb: 10, px: { xs: 2, md: 3 } }}>
        <AmbiguedadesHeader
          title="Validación de requisitos"
          subtitle="Confirma el estado final de cada requisito antes de cerrar su revisión"
        />

        {/* 🔴 SIN DATOS */}
        {!hayRequisitos && (
          <Paper sx={{ p: 4, mt: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              No hay requisitos disponibles para validar
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Primero debes analizar requisitos para generar resultados.
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push(`/ambiguedades/${proyectoId}/seleccionar`)}>
              Ir a selección de requisitos
            </Button>
          </Paper>
        )}

        {/* 🟢 CONTENIDO */}
        {hayRequisitos && (
          <Stack spacing={5} mt={4}>
            {Object.entries(CONFIG_SECCIONES).map(([tipo, config]) => {
              const grupo = requisitos.filter((r) => r.requisito?.[0]?.estadoRevision === tipo);

              return (
                <Box key={tipo}>
                  {/* HEADER SECCIÓN */}
                  <Box mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                      {config.titulo}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {config.descripcion}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* CONTENIDO */}
                  {grupo.length === 0 ? (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        textAlign: "center",
                        color: "text.secondary",
                      }}>
                      No hay requisitos en esta categoría.
                    </Paper>
                  ) : (
                    <Stack spacing={2}>
                      {grupo.map((r) => {
                        const req = r.requisito?.[0];

                        if (!r.identificador) return null;

                        return (
                          <ValidarCard
                            key={r.documentId}
                            documentId={r.documentId}
                            identificador={r.identificador}
                            nombre={req?.nombre || ""}
                            descripcion={req?.descripcion || ""}
                            estado={req?.estadoRevision || ""}
                            version={req?.version || 1}
                            estadoLocal={estados[r.documentId]}
                            onValidar={() => handleEstado(r.documentId, "VALIDADO")}
                            onRechazar={() => handleEstado(r.documentId, "NO_VALIDADO")}
                          />
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}

        {/* 🔵 BARRA GUARDAR */}
        {hayRequisitos && (
          <Paper
            sx={{
              position: "sticky",
              bottom: 0,
              mt: 4,
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={500}>
                {totalValidados} de {requisitos.length} requisitos revisados
              </Typography>

              <Button variant="contained" onClick={guardarCambios}>
                Guardar validación
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>

      <NoticeDialog
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        title="Notificación"
        message={noticeMessage}
        type={noticeType}
      />
    </DashboardLayout>
  );
}
