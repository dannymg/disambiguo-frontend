import axiosInstance from '@/services/lib/axios';
import { Proyecto } from '@/types/entities';
import { getCurrentUser, checkIsAnalista } from '@/services/auth/auth-service';

export const proyectoService = {
  // Obtener todos los proyectos del usuario autenticado
  async getAllProyectos(): Promise<Proyecto[]> {
    const currentUser = await getCurrentUser();
    const response = await axiosInstance.get<{ data: Proyecto[] }>(`/proyectos`, {
      params: {
        filters: {
          usuarios: {
            id: {
              $eq: currentUser.id,
            },
            _sort: 'updatedAt:desc',
          },
        },
        populate: ["usuarios", "listaRequisitos"],
      },
    });
    return response.data.data;
  },

  // Obtener un proyecto por ID (verificando que pertenezca al usuario)
  async getProyectoById(id: number): Promise<Proyecto> {
    const currentUser = await getCurrentUser();
    const response = await axiosInstance.get<{ data: Proyecto }>(`/proyectos/${id}`, {
      params: {
        filters: {
          usuarios: {
            id: {
              $eq: currentUser.id,
            },
          },
        },
        populate: ["usuarios", "listaRequisitos"],
      },
    });
    return response.data.data;
  },

  // Crear un nuevo proyecto
  async createProyecto(proyecto: Omit<Proyecto, "id" | "usuarios">): Promise<Proyecto> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para crear proyectos")
    }
    const currentUser = await getCurrentUser();
    const response = await axiosInstance.post<{ data: Proyecto }>("/proyectos", {
      data: {
        ...proyecto,
        usuarios: [currentUser.id],
      },
    });
    return response.data.data
  },

  // Actualizar un proyecto
  async updateProyecto(id: number, proyecto: Partial<Proyecto>): Promise<Proyecto> {
    if (!(await checkIsAnalista())) {
      throw new Error('No tiene permisos para actualizar el proyecto');
    }
    const response = await axiosInstance.put<{ data: Proyecto }>(`/proyectos/${id}`, { data: proyecto })
    return response.data.data
  },

  async deleteProyecto(id: number): Promise<void> {
    if (!(await checkIsAnalista())) {
      throw new Error('No tiene permisos para eliminar el proyecto');
    }
    await axiosInstance.delete(`/proyectos/${id}`);
  }
};