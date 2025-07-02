import axiosInstance from "@/lib/axios";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { Proyecto, ProyectoCreate, ProyectoUpdate } from "@/types";
import { getCurrentUser, checkIsAnalista } from "@/hooks/auth/auth";

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
          sort: "updatedAt:desc",
          populate: {
            usuarios: true,
            listaRequisitos: {
              populate: ["requisito"],
            },
          },
          fields: ["*"],
        },
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ Proyectos obtenidos:", response.data.data);
      }

      return response.data.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // ======== Obtener un proyecto por su documentId ========
  async getProyectoByDocumentId(proyectoId: string): Promise<Proyecto> {
    try {
      if (process.env.NODE_ENV !== "production") {
        console.log("🔍 Buscando proyecto con documentId:", proyectoId);
      }

      const response = await axiosInstance.get<{ data: Proyecto }>(`/proyectos/${proyectoId}`, {
        params: {
          populate: {
            usuarios: {
              fields: ["documentId", "username", "email"],
            },
            listaRequisitos: {
              populate: "*",
              fields: ["*"],
            },
          },
          fields: ["*"],
        },
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ Proyecto obtenido por ID:", response.data.data);
      }

      return response.data.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // ========= Crear un nuevo proyecto ========
  async createProyecto(proyecto: ProyectoCreate): Promise<Proyecto> {
    try {
      //Verificar de Rol
      if (!(await checkIsAnalista())) {
        throw new Error("🚫 No tienes permisos para crear proyectos");
      }
      //Obtener del usuario actual, para asignar el proyecto.
      const currentUser = await getCurrentUser();

      //Preparar el payload para la creación
      const payload = {
        data: {
          ...proyecto, //Spread operator
          usuarios: {
            connect: [currentUser.id],
          },
        },
      };

      const response = await axiosInstance.post<{ data: Proyecto }>(`/proyectos`, payload);

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ Proyecto creado:", response.data.data);
      }

      return response.data.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // ======== Actualizar un proyecto por su documentId ========
  async updateProyecto(proyectoId: string, proyecto: ProyectoUpdate): Promise<Proyecto> {
    try {
      //Verificar de Rol
      if (!(await checkIsAnalista())) {
        throw new Error("🚫 No tienes permisos para actualizar proyectos");
      }

      // Preparar el payload para el Update
      const payload = {
        data: {
          ...proyecto, //Spread operator
          palabrasClave: proyecto.palabrasClave ?? [], // Evitar null
        },
      };

      const response = await axiosInstance.put<{ data: Proyecto }>(
        `/proyectos/${proyectoId}`,
        payload
      );

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ Proyecto actualizado:", response.data.data);
      }

      return response.data.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // ======== Eliminar un proyecto por su documentId ========
  async deleteProyecto(proyectoId: string): Promise<void> {
    try {
      if (!(await checkIsAnalista())) {
        throw new Error("🚫 No tienes permisos para eliminar proyectos");
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("🔍 Eliminando proyecto con documentId:", proyectoId);
      }

      await axiosInstance.delete(`/proyectos/${proyectoId}`);

      if (process.env.NODE_ENV !== "production") {
        console.log(`✔️ Proyecto eliminado correctamente: ${proyectoId}`);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  },
};
