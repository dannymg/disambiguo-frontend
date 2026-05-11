import axiosInstance from "@/lib/axios"; // ajusta según tu estructura
import { ensureAnalista } from "@/hooks/auth";
import type { Ambiguedad, Correccion, VersionRequisito } from "@/types";

export const ambiguedadService = {
  async guardarResultadoLLM({
    proyectoId,
    identificador,
    nombreAmbiguedad,
    explicacionAmbiguedad,
    tipoAmbiguedad,
    descripcionGenerada,
  }: {
    proyectoId: string;
    identificador: string;
    nombreAmbiguedad: string;
    explicacionAmbiguedad: string;
    tipoAmbiguedad: string;
    descripcionGenerada: string;
  }): Promise<Correccion> {
    const currentUser = await ensureAnalista();

    if (process.env.NODE_ENV !== "production") {
      console.log("🔍 Usuario actual:", currentUser);
    }

    // Paso 1: Obtener requisito activo
    const versionRes = await axiosInstance.get<{ data: VersionRequisito[] }>(
      "/version-requisitos",
      {
        params: {
          filters: {
            proyecto: { documentId: { $eq: proyectoId } },
            identificador: { $eq: identificador },
          },
          populate: {
            requisito: {
              filters: { esVersionActiva: { $eq: true } },
            },
          },
        },
      }
    );

    const version = versionRes.data.data[0];
    console.log("🔍 Versión de requisito encontrada:", version);
    const requisito = version?.requisito?.[0];
    console.log("🔍 Requisito encontrado:", requisito);

    if (!requisito) {
      throw new Error(`No se encontró el requisito activo para ${identificador}`);
    }

    const ambiguedadPayload = {
      data: {
        nombre: nombreAmbiguedad,
        explicacion: explicacionAmbiguedad,
        tipoAmbiguedad: tipoAmbiguedad,
      },
    };

    console.log("🔹 Payload ambigüedad:", ambiguedadPayload);

    const ambiguedadRes = await axiosInstance.post<{ data: Ambiguedad }>(
      "/ambiguedades",
      ambiguedadPayload
    );
    const ambiguedad = ambiguedadRes.data.data;

    console.log("✅ Ambigüedad creada:", ambiguedad);

    // Paso 2: Actualizar requisito con la ambigüedad
    await axiosInstance.put(`/requisitos/${requisito.documentId}`, {
      data: {
        ambiguedad: {
          connect: [ambiguedad.documentId],
        },
      },
    });
    console.log(
      `✅ Requisito ${requisito.documentId} actualizado con ambigüedad ${ambiguedad.documentId}`
    );

    // Paso 3: Crear corrección
    const correccionPayload = {
      data: {
        textoGenerado: descripcionGenerada,
        esAceptada: false,
        esModificada: false,
        comentarioModif: "",
        idAmbiguedad: {
          connect: [ambiguedad.documentId],
        },
        creadoPor: currentUser.email,
      },
    };

    console.log("🔹 Payload corrección:", correccionPayload);

    const correccionRes = await axiosInstance.post<{ data: Correccion }>(
      "/correcciones",
      correccionPayload
    );

    console.log("✅ Corrección creada:", correccionRes.data.data);

    return correccionRes.data.data;
  },
};
