import axiosInstance from '@/services/lib/axios';
import { Proyecto } from '@/types/entities';
import { checkIsAnalista } from '@/services/auth/auth-service';

export const proyectoService = {
  async getProyectos(): Promise<Proyecto[]> {
    const isAnalista = await checkIsAnalista();
    if (!isAnalista) {
      throw new Error('No tiene permisos para acceder a los proyectos');
    }
    const response = await axiosInstance.get('/proyectos?populate=*');
    return response.data.data;
  },

  async getProyecto(id: number): Promise<Proyecto> {
    const isAnalista = await checkIsAnalista();
    if (!isAnalista) {
      throw new Error('No tiene permisos para acceder al proyecto');
    }
    const response = await axiosInstance.get(`/proyectos/${id}?populate=*`);
    return response.data.data;
  },

  async createProyecto(proyecto: Partial<Proyecto>): Promise<Proyecto> {
    const isAnalista = await checkIsAnalista();
    if (!isAnalista) {
      throw new Error('No tiene permisos para crear proyectos');
    }
    const response = await axiosInstance.post('/proyectos', { data: proyecto });
    return response.data.data;
  },

  async updateProyecto(id: number, proyecto: Partial<Proyecto>): Promise<Proyecto> {
    const isAnalista = await checkIsAnalista();
    if (!isAnalista) {
      throw new Error('No tiene permisos para actualizar el proyecto');
    }
    const response = await axiosInstance.put(`/proyectos/${id}`, { data: proyecto });
    return response.data.data;
  },

  async deleteProyecto(id: number): Promise<void> {
    const isAnalista = await checkIsAnalista();
    if (!isAnalista) {
      throw new Error('No tiene permisos para eliminar el proyecto');
    }
    await axiosInstance.delete(`/proyectos/${id}`);
  }
};