"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  Paper,
} from "@mui/material";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { versionService } from "@/api/versionRequisitoService";
import { requisitoService } from "@/api/requisitoService";
import NoticeDialog from "@/components/common/Dialogs/NoticeDialog";
import { ambiguedadService } from "@/api/ambiguedadService";
import { correccionService } from "@/api/correccionService";
import { proyectoService } from "@/api/proyectoService";
import CorreccionCard from "@/components/appComponents/ambiguedades/CorreccionCard";
import AmbiguedadesHeader from "@/components/appComponents/ambiguedades/AmbiguedadesHeader";
import ConfirmDialog from "@/components/common/Dialogs/ConfirmDialog";
import { VersionRequisito } from "@/types";
import { useRouter } from "next/navigation";

const DELAY_MS = 5000;

export default function DeteccionPage() {
  const { proyectoId } = useParams() as { proyectoId: string };
  const router = useRouter();

  const [identificadores, setIdentificadores] = useState<string[]>([]);
  const [searchReady, setSearchReady] = useState(false);
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progreso, setProgreso] = useState(0);

  const [requisitoARechazar, setRequisitoARechazar] = useState<any | null>(null);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "warning" | "info">("info");

  const alreadyProcessedRef = useRef(false);

  const revisados = resultados.filter((r) => r.estadoLocal !== null || r.esVacio).length;
  const total = resultados.length;
  const porcentajeRevisados = total > 0 ? (revisados / total) * 100 : 0;

  useEffect(() => {
    const requisitos = new URLSearchParams(window.location.search)
      .get("requisitos")
      ?.split(",")
      .filter(Boolean);

    setIdentificadores(requisitos ?? []);
    setSearchReady(true);
  }, []);

  useEffect(() => {
    if (!searchReady || alreadyProcessedRef.current) return;
    alreadyProcessedRef.current = true;

    const analizar = async () => {
      const proyecto = await proyectoService.getProyectoByDocumentId(proyectoId);
      const contextoProyecto = proyecto?.contexto ?? "";

      for (let i = 0; i < identificadores.length; i++) {
        const identificador = identificadores[i];

        try {
          const version: VersionRequisito | null = await versionService.getVersionYRequisitoActivo(
            identificador,
            proyectoId
          );

          const req = version?.requisito?.[0];
          if (!req) continue;

          const response = await fetch("/api/cohere", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo: identificador.startsWith("RF") ? "Funcional" : "No Funcional",
              numeroID: identificador,
              nombre: req.nombre,
              descripcion: req.descripcion,
              contextoProyecto,
            }),
          });

          const data = await response.json();

          const camposVacios =
            !data.nombreAmbiguedad?.trim() ||
            !data.explicacionAmbiguedad?.trim() ||
            !data.tipoAmbiguedad?.trim() ||
            !data.descripcionGenerada?.trim();

          const correccion = await ambiguedadService.guardarResultadoLLM({
            proyectoId,
            identificador,
            nombreAmbiguedad: data.nombreAmbiguedad,
            explicacionAmbiguedad: data.explicacionAmbiguedad,
            tipoAmbiguedad: data.tipoAmbiguedad,
            descripcionGenerada: data.descripcionGenerada,
          });

          if (!camposVacios) {
            await requisitoService.setEstadoRevision(identificador, proyectoId, "AMBIGUO");
          }

          if (camposVacios) {
            await requisitoService.setEstadoRevision(identificador, proyectoId, "NO_AMBIGUO");
          }

          if (!correccion.documentId) continue;

          setResultados((prev) => [
            ...prev,
            {
              documentId: correccion.documentId,
              identificador,
              nombreAmbiguedad: data.nombreAmbiguedad,
              explicacionAmbiguedad: data.explicacionAmbiguedad,
              tipoAmbiguedad: data.tipoAmbiguedad,
              descripcionGenerada: correccion.textoGenerado,
              nombreRequisito: req.nombre,
              descripcionOriginal: req.descripcion,
              estadoLocal: null,
              ...(camposVacios && { esVacio: true }),
            },
          ]);

          setProgreso(i + 1);
        } catch (err) {
          console.error(err);
        }

        await new Promise((res) => setTimeout(res, DELAY_MS));
      }

      setLoading(false);
    };

    analizar();
  }, [identificadores, proyectoId, searchReady]);

  const marcarComo = (documentId: string, estado: "ACEPTADO" | "RECHAZADO") => {
    setResultados((prev) =>
      prev.map((item) => (item.documentId === documentId ? { ...item, estadoLocal: estado } : item))
    );
  };

  const handleAceptar = (documentId: string) => {
    marcarComo(documentId, "ACEPTADO");
  };

  const handleRechazarConfirmado = () => {
    if (!requisitoARechazar) return;
    marcarComo(requisitoARechazar.documentId, "RECHAZADO");
    setRequisitoARechazar(null);
  };

  const handleModificar = async (documentId: string, nuevoTexto: string, comentario: string) => {
    try {
      const actualizada = await correccionService.actualizarCorreccion(
        documentId,
        nuevoTexto,
        comentario
      );

      setResultados((prev) =>
        prev.map((item) =>
          item.documentId === documentId
            ? {
                ...item,
                descripcionGenerada: actualizada.textoGenerado,
                comentarioModif: actualizada.comentarioModif,
                estadoLocal: "MODIFICADO",
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const guardarCambios = async () => {
    const noProcesados = resultados.filter((r) => r.estadoLocal === null && !r.esVacio);

    if (noProcesados.length > 0) {
      setNoticeMessage("Aún hay requisitos sin revisar.");
      setNoticeType("warning");
      setNoticeOpen(true);
      return;
    }

    try {
      for (const item of resultados) {
        if (item.estadoLocal === "ACEPTADO") {
          const version = await versionService.getVersionYRequisitoActivo(
            item.identificador,
            proyectoId
          );

          const req = version?.requisito?.[0];
          if (!req) continue;

          await versionService.updateVersionRequisito(version.documentId, {
            nombre: req.nombre,
            descripcion: item.descripcionGenerada,
            prioridad: req.prioridad,
            estadoRevision: "CORREGIDO",
            creadoPor: req.creadoPor,
          });

          await correccionService.actualizarEsAceptada(item.documentId, true);
          await requisitoService.setEstadoRevision(item.identificador, proyectoId, "CORREGIDO");
        }

        if (item.estadoLocal === "RECHAZADO") {
          await requisitoService.setEstadoRevision(item.identificador, proyectoId, "AMBIGUO");
        }

        if (item.estadoLocal === "MODIFICADO") {
          await correccionService.actualizarCorreccion(
            item.documentId,
            item.descripcionGenerada,
            item.comentarioModif || ""
          );
          await requisitoService.setEstadoRevision(item.identificador, proyectoId, "MODIFICADO");
        }

        if (item.esVacio) {
          await requisitoService.setEstadoRevision(item.identificador, proyectoId, "NO_AMBIGUO");
        }
      }

      setResultados((prev) => prev.map((item) => ({ ...item, estadoLocal: null })));

      setNoticeMessage("Cambios guardados correctamente.");
      setNoticeType("success");
      setNoticeOpen(true);
      setNoticeMessage("Cambios guardados correctamente.");
      setNoticeType("success");
      setNoticeOpen(true);

      setTimeout(() => {
        router.push(`/ambiguedades`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setNoticeMessage("Error al guardar cambios.");
      setNoticeType("error");
      setNoticeOpen(true);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mt: 4, mb: 10, px: { xs: 2, md: 3 } }}>
        <AmbiguedadesHeader
          title="Detección de ambigüedades"
          subtitle="El sistema analiza automáticamente los requisitos y propone correcciones"
        />

        {/* LOADING */}
        {loading && (
          <Paper sx={{ p: 4, mt: 3 }}>
            <Stack spacing={3} alignItems="center">
              <CircularProgress />
              <Typography variant="h6">Analizando requisitos...</Typography>
              <Box sx={{ width: "100%", maxWidth: 500 }}>
                <LinearProgress
                  variant="determinate"
                  value={(progreso / identificadores.length) * 100}
                />
              </Box>
              <Typography variant="body2">
                {progreso} de {identificadores.length}
              </Typography>
            </Stack>
          </Paper>
        )}

        {/* RESULTADOS */}
        {!loading && (
          <>
            <Box mt={3}>
              <Typography fontWeight={600}>
                Revisados: {revisados}/{total}
              </Typography>
              <LinearProgress value={porcentajeRevisados} variant="determinate" />
            </Box>

            <Stack spacing={2} mt={3}>
              {resultados.map((item) => (
                <CorreccionCard
                  key={item.documentId}
                  {...item}
                  onModificar={handleModificar}
                  onRechazar={() => setRequisitoARechazar(item)}
                  onAceptar={() => handleAceptar(item.documentId)}
                />
              ))}
            </Stack>
          </>
        )}

        {/* GUARDAR */}
        {!loading && revisados === total && total > 0 && (
          <Paper
            sx={{
              position: "sticky",
              bottom: 0,
              mt: 3,
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Todos los requisitos revisados</Typography>
              <Button variant="contained" size="large" onClick={guardarCambios}>
                Guardar cambios
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>

      {/* DIALOGS */}
      <ConfirmDialog
        open={!!requisitoARechazar}
        onClose={() => setRequisitoARechazar(null)}
        onConfirm={handleRechazarConfirmado}
        title="Rechazar requisito"
        message={`¿Deseas rechazar ${requisitoARechazar?.identificador}?`}
        confirmText="Rechazar"
        cancelText="Cancelar"
        severity="warning"
      />

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
