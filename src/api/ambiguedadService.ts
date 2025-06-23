import axiosInstance from '@/lib/axios'; // ajusta según tu estructura
import { checkIsAnalista, getCurrentUser } from '@/hooks/auth/auth'; // ajusta según tu estructura
import type { Ambiguedad, Correccion, VersionRequisito } from '@/types/entities';

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
    if (!(await checkIsAnalista())) {
      throw new Error('No tienes permisos para guardar resultados de ambigüedad');
    }

    const currentUser = await getCurrentUser();
    console.log('🔍 Usuario actual:', currentUser);

    // Paso 1: Obtener requisito activo
    const versionRes = await axiosInstance.get<{ data: VersionRequisito[] }>('/version-requisitos', {
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
    });

    const version = versionRes.data.data[0];
    console.log('🔍 Versión de requisito encontrada:', version);
    const requisito = version?.requisito?.[0];
    console.log('🔍 Requisito encontrado:', requisito);

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

    console.log('🔹 Payload ambigüedad:', ambiguedadPayload);

    const ambiguedadRes = await axiosInstance.post<{ data: Ambiguedad }>('/ambiguedades', ambiguedadPayload);
    const ambiguedad = ambiguedadRes.data.data;

    console.log('✅ Ambigüedad creada:', ambiguedad);

    // Paso 2: Actualizar requisito con la ambigüedad
    await axiosInstance.put(`/requisitos/${requisito.documentId}`, {
      data: {
        ambiguedad: {
          connect: [ambiguedad.id],
        },
      },
    });
    console.log(`✅ Requisito ${requisito.documentId} actualizado con ambigüedad ${ambiguedad.id}`);

    // Paso 3: Crear corrección
    const correccionPayload = {
      data: {
        textoGenerado: descripcionGenerada,
        esAceptada: false,
        esModificada: false,
        comentarioModif: "",
        idAmbiguedad: {
          connect: [ambiguedad.id], 
        },
        creadoPor: currentUser.email,
      },
    };

    console.log('🔹 Payload corrección:', correccionPayload);

    const correccionRes = await axiosInstance.post<{ data: Correccion }>('/correcciones', correccionPayload);

    console.log('✅ Corrección creada:', correccionRes.data.data);

    return correccionRes.data.data;
  },
};
