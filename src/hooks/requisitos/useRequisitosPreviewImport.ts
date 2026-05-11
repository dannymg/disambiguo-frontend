"use client";

import { useCallback, useState } from "react";
import { versionService } from "@/api/versionRequisitoService";
import type { RequisitoPreview } from "@/hooks/requisitos";

export function useRequisitosPreviewImport(
  proyectoId: string,
  onSuccessOuter: (cantidad: number) => void,
  requisitos: RequisitoPreview[],
  validarTodos: () => Promise<Record<number, string>>,
  validarTodosYRetornarSeleccionadosValidos: () => Promise<RequisitoPreview[]>
) {
  const [importando, setImportando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImportar = useCallback(async () => {
    setImportando(true);

    const nuevosErrores = await validarTodos();
    const hayErrores = Object.keys(nuevosErrores).some((i) => requisitos[parseInt(i)].seleccionado);

    if (hayErrores) {
      setError("Existen errores en los requisitos seleccionados. Corrigelos antes de importar.");
      setMensaje(null);
      setImportando(false);
      return;
    }

    const seleccionados = await validarTodosYRetornarSeleccionadosValidos();
    if (seleccionados.length === 0) {
      setError("Existen errores en los requisitos seleccionados. Corrigelos antes de importar.");
      setMensaje(null);
      setImportando(false);
      return;
    }

    let creados = 0;
    try {
      for (const r of seleccionados) {
        await versionService.createVersionRequisito(
          {
            numeroID: parseInt(r.numeroID),
            tipo: r.tipo,
            nombre: r.nombre.trim(),
            descripcion: r.descripcion.trim(),
            prioridad: r.prioridad,
            version: 1,
            estadoRevision: "NO_REVISADO",
            creadoPor: "",
          },
          proyectoId
        );
        creados++;
      }

      setMensaje(`${creados} requisito(s) importados correctamente.`);
      setError(null);
      onSuccessOuter(creados);
    } catch (err) {
      console.error(err);
      setError("Error al importar los requisitos.");
      setMensaje(null);
    } finally {
      setImportando(false);
    }
  }, [
    proyectoId,
    onSuccessOuter,
    requisitos,
    validarTodos,
    validarTodosYRetornarSeleccionadosValidos,
  ]);

  return { importando, mensaje, error, handleImportar };
}
