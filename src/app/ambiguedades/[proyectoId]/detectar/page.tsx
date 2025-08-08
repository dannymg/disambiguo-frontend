"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Container, Typography, Box, CircularProgress, LinearProgress } from "@mui/material";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { versionService } from "@/api/versionRequisitoService";
import { requisitoService } from "@/api/requisitoService";
import NoticeDialog from "@/components/common/Dialogs/NoticeDialog";
import { ambiguedadService } from "@/api/ambiguedadService";
import { correccionService } from "@/api/correccionService";
import { proyectoService } from "@/api/proyectoService";
import CorreccionCard from "@/components/appComponents/ambiguedades/CorreccionCard";
import AmbiguedadesHeader from "@/components/appComponents/ambiguedades/AmbiguedadesHeader";
import ConfirmDialog from "@/components/common/Dialogs/ConfimDialog";
import { VersionRequisito } from "@/types";

const DELAY_MS = 5000;

type ResultadoLLMGenerado = {
  identificador: string;
  nombreAmbiguedad: string;
  explicacionAmbiguedad: string;
  tipoAmbiguedad: string;
  descripcionGenerada: string;
};

type CorreccionExtendida = ResultadoLLMGenerado & {
  documentId: string;
  nombreRequisito: string;
  descripcionOriginal: string;
  comentarioModif?: string;
  rechazado?: boolean;
  estadoLocal?: "ACEPTADO" | "RECHAZADO" | "MODIFICADO" | null;
  esVacio?: boolean;
};

export default function DeteccionPage() {
  const { proyectoId } = useParams() as { proyectoId: string };
  const searchParams = useSearchParams();
  const identificadores = searchParams.get("requisitos")?.split(",") ?? [];

  const [resultados, setResultados] = useState<CorreccionExtendida[]>([]);
  const [loading, setLoading] = useState(true);
  const [progreso, setProgreso] = useState(0);
  const [requisitoARechazar, setRequisitoARechazar] = useState<CorreccionExtendida | null>(null);
  const alreadyProcessedRef = useRef(false);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "warning" | "info">("info");

  const revisados = resultados.filter((r) => r.estadoLocal !== null || r.esVacio).length;
  const total = resultados.length;
  const porcentajeRevisados = total > 0 ? (revisados / total) * 100 : 0;

  useEffect(() => {
    if (alreadyProcessedRef.current) return;
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
          if (!version || !req) continue;

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

          await requisitoService.setEstadoRevision(identificador, proyectoId, "AMBIGUO");

          if (!correccion.documentId) continue;

          setResultados((prev) => [
            ...prev,
            {
              documentId: correccion.documentId!,
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
        } catch (error) {
          console.error(`❌ Error al procesar ${identificador}:`, error);
        }

        await new Promise((res) => setTimeout(res, DELAY_MS));
      }

      setLoading(false);
    };

    if (identificadores.length > 0) {
      analizar();
    } else {
      setLoading(false);
    }
  }, [identificadores, proyectoId]);

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
      console.error("❌ Error al modificar la corrección:", err);
    }
  };

  const guardarCambios = async () => {
    const noProcesados = resultados.filter((r) => r.estadoLocal === null && !r.esVacio);

    if (noProcesados.length > 0) {
      setNoticeMessage("Aún hay requisitos sin revisar. Por favor revisa todo antes de guardar.");
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
          const requisitoActivo = version?.requisito?.[0];
          if (!version || !requisitoActivo) continue;

          await versionService.updateVersionRequisito(version.documentId, {
            nombre: requisitoActivo.nombre,
            descripcion: item.descripcionGenerada,
            prioridad: requisitoActivo.prioridad,
            estadoRevision: "CORREGIDO",
            creadoPor: requisitoActivo.creadoPor,
          });

          await correccionService.actualizarEsAceptada(item.documentId, true);
          await requisitoService.setEstadoRevision(item.identificador, proyectoId, "CORREGIDO");
        }

        if (item.estadoLocal === "RECHAZADO") {
          await requisitoService.setEstadoRevision(item.identificador, proyectoId, "NO_CORREGIDO");
        }

        if (item.estadoLocal === "MODIFICADO") {
          await correccionService.actualizarCorreccion(
            item.documentId,
            item.descripcionGenerada,
            item.comentarioModif || ""
          );
        }
      }

      setResultados((prev) => prev.map((item) => ({ ...item, estadoLocal: null })));
      setNoticeMessage("✅ Cambios guardados exitosamente.");
      setNoticeType("success");
      setNoticeOpen(true);
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      setNoticeMessage("Ocurrió un error al guardar los cambios.");
      setNoticeType("error");
      setNoticeOpen(true);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <AmbiguedadesHeader
          title="Detección de ambigüedades"
          subtitle="Se presenta la recomendación del análisis realizado para cada requisito"
        />

        {!loading && total > 0 && (
          <Box mb={2}>
            <Typography>
              Requisitos revisados: {revisados}/{total}
            </Typography>
            <LinearProgress variant="determinate" value={porcentajeRevisados} />
          </Box>
        )}

        {loading && (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
            <Typography mt={2}>
              Procesando {progreso}/{identificadores.length} requisitos...
            </Typography>
          </Box>
        )}

        {resultados.map((item) => (
          <CorreccionCard
            key={item.documentId}
            {...item}
            onModificar={handleModificar}
            onRechazar={() => setRequisitoARechazar(item)}
            onAceptar={() => handleAceptar(item.documentId)}
          />
        ))}

        {revisados > 0 && revisados === total && (
          <Box textAlign="center" mt={4}>
            <button
              onClick={guardarCambios}
              style={{
                background: "#1976d2",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}>
              Guardar Cambios
            </button>
          </Box>
        )}
      </Container>

      <ConfirmDialog
        open={!!requisitoARechazar}
        onClose={() => setRequisitoARechazar(null)}
        onConfirm={handleRechazarConfirmado}
        title="Rechazar Requisito"
        message={`¿Estás seguro de que deseas rechazar el requisito ${requisitoARechazar?.identificador}? Esta acción no se puede deshacer.`}
        confirmText="Rechazar"
        cancelText="Cancelar"
        severity="warning"
      />

      <NoticeDialog
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        title={
          noticeType === "success" ? "¡Éxito!" : noticeType === "warning" ? "Advertencia" : "Error"
        }
        message={noticeMessage}
        type={noticeType}
      />
    </DashboardLayout>
  );
}
