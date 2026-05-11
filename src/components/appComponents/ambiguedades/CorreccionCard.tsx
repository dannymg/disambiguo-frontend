"use client";

import { Paper, Typography, useTheme, Box, Divider, Stack } from "@mui/material";
import { useState } from "react";

import CorreccionCardStatusDot from "./correccionCard/CorreccionCardStatusDot";
import CorreccionCardAmbiguedadColumns from "./correccionCard/CorreccionCardAmbiguedadColumns";
import CorreccionCardSugerencia from "./correccionCard/CorreccionCardSugerencia";
import CorreccionCardEstadoBanner from "./correccionCard/CorreccionCardEstadoBanner";
import CorreccionCardAcciones from "./correccionCard/CorreccionCardAcciones";

import {
  etiquetaEstadoTexto,
  estadoContenedorCorreccion,
} from "./correccionCard/correccionCardEstilos";

interface Props {
  documentId: string;
  identificador: string;
  tipoAmbiguedad: string;
  explicacionAmbiguedad: string;
  descripcionGenerada: string;
  nombreRequisito: string;
  descripcionOriginal: string;
  comentarioModif?: string;
  estadoLocal?: "ACEPTADO" | "RECHAZADO" | "MODIFICADO" | null;
  esVacio?: boolean;

  onAceptar?: (nuevaDescripcion: string) => void;
  onRechazar?: () => void;
  onModificar?: (documentId: string, textoModificado: string, comentario: string) => void;
}

export default function CorreccionCard({
  documentId,
  identificador,
  tipoAmbiguedad,
  explicacionAmbiguedad,
  descripcionGenerada,
  nombreRequisito,
  descripcionOriginal,
  comentarioModif,
  estadoLocal = null,
  esVacio = false,
  onAceptar,
  onRechazar,
  onModificar,
}: Props) {
  const theme = useTheme();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [textoEditado, setTextoEditado] = useState(descripcionGenerada);
  const [comentario, setComentario] = useState(comentarioModif ?? "Modificado manualmente");

  const estadoVisual = estadoContenedorCorreccion(theme, estadoLocal, esVacio);
  const etiqueta = etiquetaEstadoTexto(estadoLocal, esVacio);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 1,
        position: "relative",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
        ...estadoVisual,
      }}>
      {/* 🔵 Indicador lateral */}
      <CorreccionCardStatusDot
        visible={!!(estadoLocal || esVacio)}
        estadoLocal={estadoLocal}
        esVacio={esVacio}
      />

      {/* 🧠 HEADER */}
      <Stack spacing={0.5} mb={2}>
        <Typography variant="subtitle2" color="text.secondary">
          {identificador}
        </Typography>

        <Typography variant="h6" fontWeight={600}>
          {nombreRequisito}
        </Typography>
      </Stack>

      {/* 📄 DESCRIPCIÓN ORIGINAL */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "background.default",
          mb: 2,
        }}>
        <Typography variant="caption" color="text.secondary">
          Descripción original
        </Typography>

        <Typography variant="body2" fontStyle="italic">
          {descripcionOriginal}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 🔀 CONTENIDO SEGÚN ES VACÍO */}
      {esVacio ? (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "success.lighter",
            border: "1px solid",
            borderColor: "success.light",
            textAlign: "center",
            mb: 2,
          }}>
          <Typography fontWeight={600}>No se detectaron ambigüedades</Typography>

          <Typography variant="body2" color="text.secondary">
            Este requisito es claro y no requiere corrección.
          </Typography>
        </Box>
      ) : (
        <>
          {/* 🔎 AMBIGÜEDAD */}
          <Box mb={2}>
            <Typography variant="subtitle2" mb={1}>
              Problema detectado
            </Typography>

            <CorreccionCardAmbiguedadColumns
              tipoAmbiguedad={tipoAmbiguedad}
              explicacionAmbiguedad={explicacionAmbiguedad}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* ✨ SUGERENCIA */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "primary.light",
              bgcolor: "primary.lighter",
              mb: 2,
            }}>
            <Typography variant="subtitle2" mb={1}>
              Sugerencia del sistema
            </Typography>

            <CorreccionCardSugerencia
              modoEdicion={modoEdicion}
              descripcionGenerada={descripcionGenerada}
              textoEditado={textoEditado}
              onTextoChange={setTextoEditado}
              comentario={comentario}
              onComentarioChange={setComentario}
            />
          </Box>
        </>
      )}

      {/* 🟢 ESTADO */}
      {etiqueta && (
        <Box mb={2}>
          <CorreccionCardEstadoBanner texto={etiqueta} estadoLocal={estadoLocal} />
        </Box>
      )}

      {/* ⚙️ ACCIONES */}
      <CorreccionCardAcciones
        modoEdicion={modoEdicion}
        esVacio={esVacio}
        descripcionGenerada={descripcionGenerada}
        onAbrirModoEdicion={() => setModoEdicion(true)}
        onCancelarEdicion={() => {
          setModoEdicion(false);
          setTextoEditado(descripcionGenerada);
        }}
        onGuardarEdicion={() => {
          onModificar?.(documentId, textoEditado, comentario);
          setModoEdicion(false);
        }}
        onRechazar={onRechazar}
        onAceptar={() => onAceptar?.(textoEditado)}
      />
    </Paper>
  );
}
