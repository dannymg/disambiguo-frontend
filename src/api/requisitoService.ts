import axiosInstance from "@/lib/axios";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { versionService } from "./versionRequisitoService";
import { Requisito, RequisitoBase, VersionRequisito } from "@/types";

export const requisitoService = {
  async crearRequisitoParaVersion(
    versionDocumentId: string,
    data: RequisitoBase
  ): Promise<Requisito> {
    try {
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        prioridad: data.prioridad,
        version: data.version,
        esVersionActiva: true,
        estadoRevision: data.estadoRevision,
        creadoPor: data.creadoPor,
        ...(data.modificadoPor && { modificadoPor: data.modificadoPor }), //Agregar la propiedad modificadoPor solo si existe
        idVersionado: {
          connect: [versionDocumentId],
        },
      };
      const requisitoResponse = await axiosInstance.post<{ data: Requisito }>("/requisitos", {
        data: payload,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ Requisito creado:", requisitoResponse.data.data);
      }

      return requisitoResponse.data.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  async setVersionActiva(
    requisitoId: string,
    identificador: string,
    proyectoId: string
  ): Promise<void> {
    try {
      // Obtener todas los Requisitos creados para una Version
      const version = await versionService.getVersionRequisito(identificador, proyectoId);

      if (!version) {
        throw new Error(
          `No se encontró una VersionRequisito con identificador "${identificador}" en el proyecto ${proyectoId}`
        );
      }

      if (process.env.NODE_ENV !== "production") {
        console.log(`🔍 VersionRequisito obtenido con el identificador ${identificador}:`, version);
      }

      // Desactivar todos los Requisitos de la VersionRequisito
      await Promise.all(
        (version.requisito || []).map((req) =>
          axiosInstance.put(`/requisitos/${req.documentId}`, {
            data: { esVersionActiva: false },
          })
        )
      );

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ Requisitos asociados desactivados");
      }

      // Activar el Requisito seleccionado
      await axiosInstance.put(`/requisitos/${requisitoId}`, {
        data: { esVersionActiva: true },
      });

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `✔️ Requisito ${requisitoId} asignado como la versión activa de ${identificador}`
        );
      }
    } catch (error) {
      handleAxiosError(error);
    }
  },

  async setEstadoRevision(
    identificador: string,
    proyectoId: string,
    nuevoEstado: string
  ): Promise<void> {
    try {
      // Obtener la versión activa
      const version = await versionService.getVersionYRequisitoActivo(identificador, proyectoId);
      const requisitoActivo = version?.requisito?.[0];

      if (!requisitoActivo || !requisitoActivo.documentId) {
        throw new Error("No se encontró requisito activo para el identificador proporcionado.");
      }

      if (process.env.NODE_ENV !== "production") {
        console.log(`🔍 Requisito activo a modificar para ${identificador}:`, requisitoActivo);
      }

      // Actualizar su estado de revisión
      await axiosInstance.put(`/requisitos/${requisitoActivo.documentId}`, {
        data: {
          estadoRevision: nuevoEstado,
        },
      });

      if (process.env.NODE_ENV !== "production") {
        console.log(`✔️ Estado de revisión actualizado a ${nuevoEstado} para ${identificador}`);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // Verificar si un númeroID ya existe en la lista de requisitos de un proyecto
  async checkNumeroID(proyectoId: string, identificador: string): Promise<boolean> {
    try {
      if (process.env.NODE_ENV !== "production") {
        console.log("🔍 Verificando identificador:", identificador);
      }

      const response = await axiosInstance.get<{ data: VersionRequisito[] }>(
        "/version-requisitos",
        {
          params: {
            filters: {
              proyecto: {
                documentId: { $eq: proyectoId },
              },
              identificador: { $eq: identificador },
            },
            pagination: { limit: 1 },
          },
        }
      );
      const existe = response.data.data.length > 0;

      if (process.env.NODE_ENV !== "production") {
        console.log(`🔍 Identificador '${identificador}' existe en el proyecto?:`, existe);
      }

      return existe;
    } catch (error) {
      console.error("Error al verificar numeroID:", error);
      return false; // En caso de error, asumimos que no existe
    }
  },
};
