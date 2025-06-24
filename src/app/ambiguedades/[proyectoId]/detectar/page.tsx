"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { requisitoService } from "@/api/requisitoService";
import { ambiguedadService } from "@/api/ambiguedadService"; // nuevo
import { VersionRequisito } from "@/types/entities";
import CorreccionCard from "@/components/appComponents/ambiguedades/CorreccionCard";
import { correccionService } from "@/api/correccionService";
import AmbiguedadesHeader from "@/components/appComponents/ambiguedades/AmbiguedadesHeader";
import ConfirmDialog from "@/components/common/Dialogs/ConfimDialog";

const DELAY_MS = 5000; // Delay entre cada envío al LLM

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
};

export default function DeteccionPage() {
  const { proyectoId } = useParams() as { proyectoId: string };
  const searchParams = useSearchParams();
  const identificadores = searchParams.get("requisitos")?.split(",") ?? [];

  const [resultados, setResultados] = useState<CorreccionExtendida[]>([]);
  const [loading, setLoading] = useState(true);
  const [progreso, setProgreso] = useState(0);

  const alreadyProcessedRef = useRef(false);
  const [requisitoARechazar, setRequisitoARechazar] = useState<CorreccionExtendida | null>(null);

  useEffect(() => {
    if (alreadyProcessedRef.current) return;
    alreadyProcessedRef.current = true;

    const analizar = async () => {
      for (let i = 0; i < identificadores.length; i++) {
        const identificador = identificadores[i];
        try {
          // Obtener requisito activo
          const version: VersionRequisito | null =
            await requisitoService.getRequisitoByIdentificador(proyectoId, identificador);
          const req = version?.requisito?.[0];
          if (!version || !req) continue;

          // Enviar al modelo LLM
          const response = await fetch("/api/cohere", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo: identificador.startsWith("RF") ? "Funcional" : "No Funcional",
              numeroID: identificador,
              nombre: req.nombre,
              descripcion: req.descripcion,
            }),
          });

          const data = await response.json();
          console.log(`✅ Resultado LLM para ${identificador}:`, data);

          // Guardar resultado completo (ambigüedad + corrección) y obtener la corrección real
          const correccion = await ambiguedadService.guardarResultadoLLM({
            proyectoId,
            identificador,
            nombreAmbiguedad: data.nombreAmbiguedad,
            explicacionAmbiguedad: data.explicacionAmbiguedad,
            tipoAmbiguedad: data.tipoAmbiguedad,
            descripcionGenerada: data.descripcionGenerada,
          });

          // Cambiar estado del requisito a AMBIGUO
          await requisitoService.actualizarEstadoRevision(identificador, proyectoId, "AMBIGUO");

          if (!correccion.documentId) {
            console.warn(`⚠️ Corrección sin documentId para ${identificador}`);
            continue;
          }

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

  const handleModificar = async (documentId: string, nuevoTexto: string, comentario: string) => {
    try {
      const actualizada = await correccionService.actualizarCorreccion(
        documentId,
        nuevoTexto,
        comentario
      );

      console.log("actualizada:", actualizada);

      // Actualizar la tarjeta visualmente
      setResultados((prev) =>
        prev.map((item) =>
          item.documentId === documentId
            ? {
                ...item,
                descripcionGenerada: actualizada.textoGenerado,
                comentarioModif: actualizada.comentarioModif,
              }
            : item
        )
      );
    } catch (err) {
      console.error("❌ Error al modificar la corrección:", err);
    }
  };

  const handleRechazarConfirmado = async () => {
    if (!requisitoARechazar) return;

    try {
      await requisitoService.actualizarEstadoRevision(
        requisitoARechazar.identificador,
        proyectoId,
        "NO_CORREGIDO"
      );

      setResultados((prev) =>
        prev.map((item) =>
          item.documentId === requisitoARechazar.documentId ? { ...item, rechazado: true } : item
        )
      );
    } catch (err) {
      console.error(`❌ Error al rechazar requisito:`, err);
    } finally {
      setRequisitoARechazar(null);
    }
  };

  const handleAceptar = async (documentId: string, textoFinal: string) => {
    try {
      // 1. Buscar el identificador desde la lista de resultados
      const resultado = resultados.find((r) => r.documentId === documentId);
      if (!resultado) {
        console.warn("❌ No se encontró resultado para esta corrección");
        return;
      }

      const identificador = resultado.identificador;
      console.log("Identificador de requisito a buscar", identificador);

      // 2. Obtener el VersionRequisito completo (con requisito activo)
      const version = await requisitoService.getRequisitoByIdentificador(proyectoId, identificador);
      console.log("Requisito Obtenido para actualizar", version);

      if (!version || !version.documentId) {
        console.warn("❌ No se encontró el VersionRequisito con ese identificador");
        return;
      }

      const requisitoActivo = version.requisito?.[0];
      if (!requisitoActivo) {
        console.warn("❌ No hay requisito activo en esa versión");
        return;
      }
      console.log("Requisito activo", requisitoActivo);

      // 3. Crear nueva versión del requisito con la descripción corregida
      await requisitoService.updateRequisito(version.documentId, {
        nombre: requisitoActivo.nombre,
        // tipo: version.tipo,
        descripcion: textoFinal,
        prioridad: requisitoActivo.prioridad,
        estadoRevision: "CORREGIDO",
        creadoPor: requisitoActivo.creadoPor,
      });

      // Cambiar estado de Correccion
      await correccionService.actualizarEsAceptada(documentId, true);

      // 4. Eliminar la tarjeta visualmente (opcional)
      setResultados((prev) => prev.filter((r) => r.documentId !== documentId));

      console.log(`✅ Requisito ${identificador} actualizado como CORREGIDO`);
    } catch (error) {
      console.error("❌ Error al aceptar la corrección:", error);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <AmbiguedadesHeader
          title="Detección de ambigüedades"
          subtitle="Se presenta la recomendación del análisis realizado para cada requisito"
        />

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
            documentId={item.documentId}
            identificador={item.identificador}
            nombreRequisito={item.nombreRequisito}
            descripcionOriginal={item.descripcionOriginal}
            tipoAmbiguedad={item.tipoAmbiguedad}
            explicacionAmbiguedad={item.explicacionAmbiguedad}
            descripcionGenerada={item.descripcionGenerada}
            onModificar={handleModificar}
            onRechazar={() => setRequisitoARechazar(item)}
            onAceptar={(textoFinal) => handleAceptar(item.documentId, textoFinal)}
          />
        ))}
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
    </DashboardLayout>
  );
}
