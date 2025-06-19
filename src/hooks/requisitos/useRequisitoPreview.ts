'use client';

import { useState } from 'react';
import { versionService } from '@/api/version-service';

export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';
export type Tipo = 'FUNCIONAL' | 'NO_FUNCIONAL';

export interface RequisitoPreview {
  tipo: Tipo;
  numeroID: string;
  nombre: string;
  descripcion: string;
  prioridad: Prioridad;
  seleccionado: boolean;
}

export function usePrevisualizacionRequisitos(
  requisitosIniciales: RequisitoPreview[],
  proyectoId: string
) {
  const [requisitos, setRequisitos] = useState<RequisitoPreview[]>(requisitosIniciales);
  const [errores, setErrores] = useState<Record<number, string>>({});
  const [loadingValidacion, setLoadingValidacion] = useState(false);

  const actualizarCampo = (
    index: number,
    campo: keyof RequisitoPreview,
    valor: string | boolean
  ) => {
    const nuevos = [...requisitos];
    // @ts-ignore
    nuevos[index][campo] = valor;
    setRequisitos(nuevos);
  };

  const toggleSeleccionado = (index: number) => {
    actualizarCampo(index, 'seleccionado', !requisitos[index].seleccionado);
  };

  const validarTodos = async (): Promise<Record<number, string>> => {
    setLoadingValidacion(true);
    const nuevosErrores: Record<number, string> = {};
    const idsUsados = new Set<string>();

    for (let i = 0; i < requisitos.length; i++) {
      const { tipo, numeroID, nombre, descripcion, prioridad } = requisitos[i];
      const padded = numeroID.toString().padStart(3, '0');
      const identificador = `${tipo === 'FUNCIONAL' ? 'RF-' : 'RNF-'}${padded}`;

      // Validación local
      if (!/^\d{1,3}$/.test(numeroID)) {
        nuevosErrores[i] = 'Número ID inválido. Solo números de hasta 3 dígitos.';
        continue;
      }

      if (!nombre.trim() || !descripcion.trim()) {
        nuevosErrores[i] = 'Nombre o descripción no pueden estar vacíos.';
        continue;
      }

      if (!['ALTA', 'MEDIA', 'BAJA'].includes(prioridad)) {
        nuevosErrores[i] = 'Prioridad inválida.';
        continue;
      }

      if (idsUsados.has(identificador)) {
        nuevosErrores[i] = `Identificador duplicado local: ${identificador}`;
        continue;
      }

      idsUsados.add(identificador);

      // Validación remota
      try {
        const existe = await versionService.checkNumeroID(proyectoId, identificador);
        if (existe) {
          nuevosErrores[i] = `Ya existe el identificador ${identificador} en el proyecto.`;
        }
      } catch (err) {
        nuevosErrores[i] = 'Error al verificar identificador en el servidor.';
        console.error('Validación remota fallida:', err);
      }
    }
    
    setErrores(nuevosErrores);
     setLoadingValidacion(false);
     return nuevosErrores;
  };



  const obtenerSeleccionadosValidos = () => {
    return requisitos.filter((_, i) => requisitos[i].seleccionado && !errores[i]);
  };

  return {
    requisitos,
    errores,
    loadingValidacion,
    actualizarCampo,
    toggleSeleccionado,
    validarTodos,
    obtenerSeleccionadosValidos,
  };
}
