import axiosInstance from "@/services/lib/axios"
import type { Ambiguedad } from "@/types/entities"
import { checkIsAnalista } from '@/services/auth/auth-service';

export const ambiguedadService = {
     // Obtener todas las ambigüedades de un requisito
     async getAllAmbiguedades(requisitoId: number): Promise<Ambiguedad[]>{
          const response = await axiosInstance.get<{ data: Ambiguedad[] }>(`/ambiguedades`, {
          params: {
               filters: {
                    
               requisito: {
                    id: {
                    $eq: requisitoId,
                    },
               },
               },
               populate: ["correcciones"],
          },
          });
          return response.data.data
     },

     // Obtener una ambigüedad por ID
     async getAmbiguedadById(id: number): Promise<Ambiguedad>{
          const response = await axiosInstance.get<{ data: Ambiguedad }>(`/ambiguedades/${id}`, {
          params: {
               populate: ["correcciones"],
          },
          });
          return response.data.data
     },

     // Crear una nueva ambigüedad
     async createAmbiguedad(ambiguedad: Omit<Ambiguedad, "id">): Promise<Ambiguedad>{
          if (!(await checkIsAnalista())) {
          throw new Error("No tienes permisos para crear ambigüedades")
          }
          const response = await axiosInstance.post<{ data: Ambiguedad }>(`/ambiguedades`, { data: ambiguedad })
          return response.data.data
     },

     // Actualizar una ambigüedad
     async updateAmbiguedad(id: number, ambiguedad: Partial<Ambiguedad>): Promise<Ambiguedad>{
          if (!(await checkIsAnalista())) {
          throw new Error("No tienes permisos para actualizar ambigüedades")
          }
          const response = await axiosInstance.put<{ data: Ambiguedad }>(`/ambiguedades/${id}`, { data: ambiguedad })
          return response.data.data
     },

     // Eliminar una ambigüedad
     async deleteAmbiguedad(id: number): Promise<void>{
          if (!(await checkIsAnalista())) {
          throw new Error("No tienes permisos para eliminar ambigüedades")
          }
          await axiosInstance.delete(`/ambiguedades/${id}`)
     }
}