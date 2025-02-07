import axiosInstance from '@/app/lib/axios';
import { Proyecto } from '@/types/entities';
import { getCurrentUser, checkIsAnalista } from '@/hooks/auth/auth-service';
import { VersionRequisito } from '@/types/entities';

interface CreateProyectoData {
  titulo: string;
  descripcion: string;
  contexto: string;
  listaEspecificaciones: string;
  version: number;
  esActivo: boolean;
  listaRequisitos: VersionRequisito[];
  creadoPor: string;
}

export const proyectoService = {
  // Obtener todos los proyectos del usuario autenticado
  async getAllProyectos(): Promise<Proyecto[]> {
    try {
        const currentUser = await getCurrentUser();
        
        const response = await axiosInstance.get<{ data: Proyecto[] }>(`/proyectos`, {
          params: {
            filters: {
              usuarios: {
                id: {
                  $eq: currentUser.id,
                },
              },
            },
            sort: 'updatedAt:desc',
            populate: ["usuarios", "listaRequisitos"],
            fields: ['*']
          },
        });
        
        console.log('getAllProyectos:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching proyectos:', error);
        throw error; // O maneja el error como prefieras
    }
  },

  // Obtener un proyecto por documentId 
  async getProyectoById(proyectoId: string): Promise<Proyecto> {
    console.log('Fetching proyecto with documentId:', proyectoId);
  
    const response = await axiosInstance.get<{ data: Proyecto }>(`/proyectos/${proyectoId}`, {
      params: {
        // documentId: proyectoId,
        populate: {
          usuarios: {
            fields: ['documentId', 'username', 'email']
          },
          listaRequisitos: {
            populate: '*',
            fields: ['*']
          }
        },
        fields: ['*']
      },
    });
    console.log('respuesta getProyectoById:', response);
    return response.data.data;
  },

  async createProyecto(proyecto: CreateProyectoData): Promise<Proyecto> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para crear proyectos");
    }

    console.log('Accediendo a crear');
  
    const currentUser = await getCurrentUser();
    
    // Strapi espera que los datos estén dentro de un objeto 'data'
    const payload = {
      data: {
        titulo: proyecto.titulo,
        descripcion: proyecto.descripcion,
        contexto: proyecto.contexto,
        listaEspecificaciones: proyecto.listaEspecificaciones,
        version: proyecto.version,
        esActivo: proyecto.esActivo,
        creadoPor: proyecto.creadoPor,
        // Relacionar el usuario actual usando el formato correcto de Strapi
        usuarios: {
          connect: [currentUser.id]
        }
      }
    };
  
    console.log('Payload:', payload);

    try {
      const response = await axiosInstance.post<{ data: Proyecto }>("/proyectos", payload);
      console.log("Proyecto creado:", response.data.data);
      return response.data.data;
    } catch (error) {
      const err = error as any;
      console.error('Error creating proyecto:', err.response?.data || err);
      throw error;
    }
  },

  // Actualizar un proyecto
  async updateProyecto(id: number, proyecto: Partial<Proyecto>): Promise<Proyecto> {
    if (!(await checkIsAnalista())) {
      throw new Error('No tiene permisos para actualizar el proyecto');
    }
    const response = await axiosInstance.put<{ data: Proyecto }>(`/proyectos/${id}`, { data: proyecto })
    console.log('updateProyecto:', response.data.data);
    return response.data.data
  },

  async deleteProyecto(id: number): Promise<void> {
    if (!(await checkIsAnalista())) {
      throw new Error('No tiene permisos para eliminar el proyecto');
    }
    console.log('deleteProyecto:', id);
    await axiosInstance.delete(`/proyectos/${id}`);
  }
};