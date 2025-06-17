import axiosInstance from '@/lib/axios';
import { Correccion } from '@/types/entities';
import { checkIsAnalista } from '@/hooks/auth/auth';

export const correccionService = {
     // Obtener todas las correcciones de una ambigüedad
     async getAllCorrecciones(ambiguedadId: number): Promise<Correccion[]>{
          const response = await axiosInstance.get<{ data: Correccion[] }>(`/correcciones`, {
          params: {
               filters: {
               idAmbiguedad: {
                    id: {
                    $eq: ambiguedadId,
                    },
               },
               },
               populate: ["idAmbiguedad"],
          },
          });
          return response.data.data
     },

     // Obtener una corrección por ID
     async getCorreccionById(id: number): Promise<Correccion>{
          const response = await axiosInstance.get<{ data: Correccion }>(`/correcciones/${id}`, {
          params: {
               populate: ["idAmbiguedad"],
          },
          });
          return response.data.data
     },

     // Crear una nueva corrección
     async createCorreccion(correccion: Omit<Correccion, "id">): Promise<Correccion> {
          if (!(await checkIsAnalista())) {
          throw new Error("No tienes permisos para crear correcciones")
          }
          const response = await axiosInstance.post<{ data: Correccion }>(`/correcciones`, { data: correccion })
          return response.data.data
     },

     // Actualizar una corrección
     async updateCorreccion(id: number, correccion: Partial<Correccion>): Promise<Correccion>{
          if (!(await checkIsAnalista())) {
          throw new Error("No tienes permisos para actualizar correcciones")
          }
          const response = await axiosInstance.put<{ data: Correccion }>(`/correcciones/${id}`, { data: correccion })
          return response.data.data
     },

     // Eliminar una corrección
     async deleteCorreccion(id: number): Promise<void> {
          if (!(await checkIsAnalista())) {
          throw new Error("No tienes permisos para eliminar correcciones")
          }
          await axiosInstance.delete(`/correcciones/${id}`)
     }
}