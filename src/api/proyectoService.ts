import axiosInstance from '@/lib/axios';
import { Proyecto, ProyectoCreate, ProyectoUpdate} from '@/types/entities';
import { getCurrentUser, checkIsAnalista } from '@/hooks/auth/auth';


export const proyectoService = {
  // ======== Obtener todos los proyectos del usuario actual ========
  async getAllProyectos(): Promise<Proyecto[]> {
    try {
        const currentUser = await getCurrentUser();
        
        const response = await axiosInstance.get<{ data: Proyecto[] }>(`/proyectos`, {
          params: {
            filters: {
              usuarios: {
                id: { $eq: currentUser.id },
              },
            },
            sort: 'updatedAt:desc',
            populate: ["usuarios", "listaRequisitos"],
            fields: ['*'],
          },
        });
        
        console.log('getAllProyectos:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error obteniendo proyectos:', error);
        throw error;
    }
  },

  // ======== Obtener un proyecto por su documentId ========
  async getProyectoById(documentId: string): Promise<Proyecto> {
    try {
        console.log('Obteniendo proyecto con documentId:', documentId);  
        const response = await axiosInstance.get<{ data: Proyecto }>(`/proyectos/${documentId}`, {
          params: {
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
        console.log('getProyectoById:', response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('Error obteniendo proyectos:', error);
        throw error;
    }
  }, 

  // ========= Crear un nuevo proyecto ========
  async createProyecto(proyecto: ProyectoCreate): Promise<Proyecto> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para crear proyectos");
    }
  
    const currentUser = await getCurrentUser();
    
    // Preparar el payload para la creación
    const payload = {
      data: {
        ...proyecto, // Usar el spread operator para incluir todos los campos
        usuarios: {
          connect: [currentUser.id],
        }
      }
    };
  
    console.log('Payload para crear:', payload);

    // Ejecutar la creación
    try {
      const response = await axiosInstance.post<{ data: Proyecto }>("/proyectos", payload);
      console.log("Proyecto creado:", response.data.data);
      return response.data.data;
    } catch (error) {
      const err = error as any;
      console.error('Error al crear proyecto:', err.response?.data || err);
      throw error;
    }
  },

  // ======== Actualizar un proyecto por su documentId ========
  async updateProyecto(documentId: string, proyecto: ProyectoUpdate): Promise<Proyecto> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para actualizar el proyecto");
    }

    // Preparar el payload para el update
    const payload = {
      data: {
        ...proyecto, // Usar el spread operator para incluir todos los campos
        palabrasClave: proyecto.palabrasClave ?? [], // evitar null
        // Relacionar usuarios si es necesario (opcional)
        // usuarios: { connect: [userId] }
      }
    };
    console.log("Payload para update:", payload);

    // Ejecutar el update
    try {
      const response = await axiosInstance.put<{ data: Proyecto }>(`/proyectos/${documentId}`, payload);
      console.log("Proyecto actualizado:", response.data.data);
      return response.data.data;
    } catch (error) {
      const err = error as any;
      console.error("Error actualizando proyecto:", err.response?.data || err);
      throw error;
    }
  },

  // ======== Eliminar un proyecto por su documentId ========
  async deleteProyecto(documentId: string): Promise<void> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para eliminar proyectos");
    }

    console.log("Eliminando proyecto con documentId:", documentId);

    // Ejecutar eliminación
    try {
      await axiosInstance.delete(`/proyectos/${documentId}`);
      console.log(`Proyecto eliminado correctamente: ${documentId}`);
    } catch (error) {
      const err = error as any;
      console.error("Error eliminando proyecto:", err.response?.data || err);
      throw new Error("No se pudo eliminar el proyecto");
    }
  }
};