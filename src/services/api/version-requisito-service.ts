import axiosInstance from '@/services/lib/axios';
import { VersionRequisito, Requisito } from '@/types/entities';
import { checkIsAnalista } from '@/services/auth/auth-service';

export const versionService = {
  // Obtener todos los requisitos de un proyecto manejados por "VersionRequisito"
  async getAllVersionRequisito(idProyecto: number): Promise<VersionRequisito[]> {
    const response = await axiosInstance.get<{ data: VersionRequisito[] }>(`/version-requisitos`, {
        params: {
        filters: {
            proyecto: {
            id: {
                $eq: idProyecto,
            },
            },
        },
        populate: {
            requisito: {
            filters: {
                esVersionActiva: {
                $eq: true,
                },
            },
            },
            proyecto: true, // Cargar el campo proyecto en la respuesta
        },
        },
    });
    return response.data.data
  },

  // Obtener un requisito por ID
  async getVersionRequisitoById(id: number): Promise<VersionRequisito[]> {
    const response = await axiosInstance.get<{ data: VersionRequisito[] }>(`/version-requisitos/${id}`, {
      params: {
        populate: {
          requisito: {
            filters: {
              esVersionActiva: {
                $eq: true,
              },
            },
          },
          proyecto: true,
        },
      },
    });
    return response.data.data
  },

  // Crear nueva VersionRequisito, con su Requisito asociado
  async createVersionRequisito(versionRequisito: Omit<VersionRequisito, "id">, requisito: Omit<Requisito, "id" | "idVersionado">): Promise<VersionRequisito> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para crear versiones de requisitos")
    }

    // 1. Crear VersionRequisito
    const versionResponse = await axiosInstance.post<{ data: VersionRequisito }>(`/version-requisitos`, {
      data: versionRequisito,
    });

    // 2. Crear Requisito asociado
    const requisitoData = {
      ...requisito,
      idVersionado: versionResponse.data.data.id,
      esVersionActiva: true,
    }

    await axiosInstance.post<{ data: Requisito }>(`/requisitos`, {
      data: requisitoData,
    });

    return versionResponse.data.data;
  },

  // Eliminar VersionRequisito, con sus Requisitos asociados
  async deleteVersionRequisito(id: number): Promise<void> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para eliminar versiones de requisitos")
    }

    // 1. Se obtiene todos los requisitos asociados a esta VersionRequisito
    const requisitosResponse = await axiosInstance.get<{ data: Requisito[] }>(`/requisitos`, {
      params: {
        filters: {
          idVersionado: {
            id: {
              $eq: id,
            },
          },
        },
      },
    });
    
    // 2. Se elimina cada requisito asociado
    for (const requisito of requisitosResponse.data.data) {
      await axiosInstance.delete(`/requisitos/${requisito.id}`)
    }
  
    // 3. Se elimina la VersionRequisito
    await axiosInstance.delete(`/version-requisitos/${id}`)
  },
};