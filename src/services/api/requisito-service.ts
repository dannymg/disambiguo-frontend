import axiosInstance from '@/services/lib/axios';
import { Requisito } from '@/types/entities';
import { checkIsAnalista } from '@/services/auth/auth-service';

export const requisitoService = {
  // Crear nuevo requisito y desactivar la versión actual
  async createAndUseRequisito(versionRequisitoId: number, requisito: Omit<Requisito, "id" | "idVersionado" | "esVersionActiva">,):
   Promise<Requisito> {
     if (!(await checkIsAnalista())) {
       throw new Error("No tienes permisos para crear nuevas versiones de requisitos")
     }

     // 1. Desactivar la versión actual
     const currentActiveRequisito = await axiosInstance.get<{ data: Requisito[] }>(`/requisitos`, {
       params: {
         filters: {
           idVersionado: {
             id: {
               $eq: versionRequisitoId,
             },
           },
           esVersionActiva: {
             $eq: true,
           },
         },
       },
     })
   
     if (currentActiveRequisito.data.data.length > 0) {
       await axiosInstance.put<{ data: Requisito }>(`/requisitos/${currentActiveRequisito.data.data[0].id}`, {
         data: { esVersionActiva: false },
       })
     }
   
     // 2. Crear la nueva versión activa
     const newRequisitoData = {
       ...requisito,
       idVersionado: versionRequisitoId,
       esVersionActiva: true,
     }
   
     const response = await axiosInstance.post<{ data: Requisito }>(`/requisitos`, {
       data: newRequisitoData,
     })
   
     return response.data.data
     }





     //async changeVersionUsada
};