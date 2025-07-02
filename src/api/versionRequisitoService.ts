// Las funciones definidas para el manejo de la entidad Requisito (CRUD) involucran el acceso a VersionRequisito, que
// es el punto de conexión entre Proyecto y Requisito, y maneja los cambios de veriones históricas de los requisitos.
import axiosInstance from "@/lib/axios";
import { VersionRequisito, Requisito, CreateRequisitoData, RequisitoBase } from "@/types";
import { checkIsAnalista, getCurrentUser } from "@/hooks/auth/auth";
import { proyectoService } from "./proyectoService";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { requisitoService } from "./requisitoService";

export const versionService = {
  // Obtener un VersionRequisito por el identificador (RF-000), con todos los Requisito asociados
  async getVersionRequisito(
    identificador: string,
    proyectoId: string
  ): Promise<VersionRequisito | null> {
    try {
      const response = await axiosInstance.get<{ data: VersionRequisito[] }>(
        "/version-requisitos",
        {
          params: {
            filters: {
              identificador: { $eq: identificador },
              proyecto: {
                documentId: { $eq: proyectoId },
              },
            },
            populate: ["requisito"],
            pagination: { limit: 1 },
          },
        }
      );
      const version = response.data.data?.[0] ?? null;

      if (process.env.NODE_ENV !== "production") {
        console.log(`✔️ VersionRequisito encontrado para el ${identificador}:`, version);
      }

      return version;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // Obtener una Lista de VersionRequisito con su Requisito activo
  async getAllVersionesYRequisitoActivo(proyectoId: string): Promise<VersionRequisito[]> {
    try {
      const response = await axiosInstance.get<{ data: VersionRequisito[] }>(
        `/version-requisitos`,
        {
          params: {
            filters: {
              proyecto: {
                documentId: { $eq: proyectoId },
              },
            },
            populate: {
              requisito: {
                filters: {
                  esVersionActiva: { $eq: true },
                },
              },
              proyecto: true, // Cargar el campo proyecto en la respuesta
            },
          },
        }
      );
      const versiones = response.data.data;

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ VersionRequisito con su Requisito activo:", versiones);
      }

      return versiones;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // Obtener un VersionRequisito con su Requisito activo
  async getVersionYRequisitoActivo(
    identificador: string,
    proyectoId: string
  ): Promise<VersionRequisito | null> {
    try {
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
            populate: {
              requisito: {
                filters: {
                  esVersionActiva: { $eq: true },
                },
              },
              proyecto: true,
            },
            pagination: { limit: 1 },
          },
        }
      );

      const version = response.data.data?.[0] ?? null;

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ VersionRequisito con requisito activo:", version);
      }

      return version;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  //Obtener el listado Requisitos asociados a un VersionRequisito
  async getAllHistorialDeRequisitos(
    identificador: string,
    proyectoId: string
  ): Promise<Requisito[]> {
    try {
      const response = await axiosInstance.get<{ data: VersionRequisito[] }>(
        "/version-requisitos",
        {
          params: {
            filters: {
              identificador: { $eq: identificador },
              proyecto: {
                documentId: { $eq: proyectoId },
              },
            },
            populate: { requisito: true },
            pagination: { limit: 1 },
          },
        }
      );

      const requisitos = response.data.data?.[0]?.requisito || [];

      if (process.env.NODE_ENV !== "production") {
        console.log(`✔️ Historial de requisitos para el ${identificador}:`, requisitos);
      }

      return requisitos;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // Crear nueva VersionRequisito, con su Requisito asociado
  async createVersionRequisito(
    requisitoData: CreateRequisitoData,
    proyectoId: string
  ): Promise<VersionRequisito> {
    try {
      if (!(await checkIsAnalista())) {
        throw new Error("No tienes permisos para crear requisitos");
      }
      const user = await getCurrentUser();
      const proyecto = await proyectoService.getProyectoByDocumentId(proyectoId);
      if (!proyecto) {
        throw new Error("El proyecto no existe");
      }
      const paddedNumeroID = String(requisitoData.numeroID).padStart(3, "0");
      // Generar identificador RF-{numeroID} o RNF-{numeroID}
      const identificador =
        requisitoData.tipo === "FUNCIONAL" ? `RF-${paddedNumeroID}` : `RNF-${paddedNumeroID}`;

      if (process.env.NODE_ENV !== "production") {
        console.log("📍 Identificador generado:", identificador);
      }
      // Crear VersionRequisito
      const versionResponse = await axiosInstance.post<{ data: VersionRequisito }>(
        "/version-requisitos",
        {
          data: {
            numeroID: requisitoData.numeroID,
            tipo: requisitoData.tipo,
            identificador: identificador,
            proyecto: proyecto.id,
          },
        }
      );
      const versionRequisito = versionResponse.data.data;

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ VersionRequisito creado:", versionRequisito);
      }

      // Crear el primer Requisito asociado a esta versión
      await requisitoService.crearRequisitoParaVersion(versionRequisito.documentId, {
        nombre: requisitoData.nombre,
        descripcion: requisitoData.descripcion,
        prioridad: requisitoData.prioridad,
        version: requisitoData.version,
        estadoRevision: requisitoData.estadoRevision,
        creadoPor: user.email,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ CREACIÓN DE REQUISITO FINALIZADA CON ÉXITO");
      }

      return versionRequisito;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  async updateVersionRequisito(
    versionRequisitoId: string,
    requisitoData: RequisitoBase
  ): Promise<Requisito> {
    try {
      if (!(await checkIsAnalista())) {
        throw new Error("No tienes permisos para crear nuevas versiones de requisitos");
      }

      const user = await getCurrentUser();

      // Obtener la Version y su Requisito activo
      const versionWrapper = await axiosInstance.get<{ data: VersionRequisito[] }>(
        `/version-requisitos`,
        {
          params: {
            filters: { documentId: { $eq: versionRequisitoId } },
            populate: {
              requisito: {
                filters: { esVersionActiva: { $eq: true } },
              },
            },
          },
        }
      );

      const version = versionWrapper.data.data?.[0];
      const activo = version?.requisito?.[0];

      if (!version || !activo) {
        throw new Error("No se encontró requisito activo para esta versión");
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("🔍 Requisito activo encontrado:", activo);
      }

      // Desactivar requisito activo
      await axiosInstance.put(`/requisitos/${activo.documentId}`, {
        data: { esVersionActiva: false },
      });

      // Obtener versión máxima
      const allVersionWrapper = await axiosInstance.get<{ data: VersionRequisito[] }>(
        `/version-requisitos`,
        {
          params: {
            filters: { documentId: { $eq: versionRequisitoId } },
            populate: { requisito: true },
          },
        }
      );

      const todasLasVersiones = allVersionWrapper.data.data?.[0]?.requisito || [];
      const maxVersion = Math.max(...todasLasVersiones.map((r) => r.version ?? 0));

      // Crear nuevo requisito
      const nuevo = await requisitoService.crearRequisitoParaVersion(version.documentId, {
        nombre: requisitoData.nombre,
        descripcion: requisitoData.descripcion,
        prioridad: requisitoData.prioridad,
        version: maxVersion + 1,
        estadoRevision: requisitoData.estadoRevision,
        creadoPor: activo.creadoPor,
        modificadoPor: user.email,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("✔️ REQUISITO ACTUALIZADO CON ÉXITO", nuevo);
      }

      return nuevo;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // Eliminar VersionRequisito, con sus Requisitos asociados
  async deleteVersionYRequisitos(versionRequisitoId: string): Promise<void> {
    try {
      if (!(await checkIsAnalista())) {
        throw new Error("No tienes permisos para eliminar versiones de requisitos");
      }
      // Buscar la versión por documentId y obtener su ID numérico y requisitos asociados
      console.log("Buscando versión por documentId:", versionRequisitoId);
      const versionWrapper = await axiosInstance.get<{ data: VersionRequisito[] }>(
        "/version-requisitos",
        {
          params: {
            filters: {
              documentId: { $eq: versionRequisitoId },
            },
            populate: {
              requisito: true,
            },
          },
        }
      );

      if (process.env.NODE_ENV !== "production") {
        console.log("🔍 Versión obtenida para eliminar:", versionWrapper.data.data);
      }

      const requisitos = versionWrapper.data.data?.[0]?.requisito || [];

      if (process.env.NODE_ENV !== "production") {
        console.log(`Requisitos asociados encontrados`, requisitos);
      }

      // Eliminar cada requisito asociado
      for (const req of requisitos) {
        if (process.env.NODE_ENV !== "production") {
          console.log(` ✔️Eliminando Requisito con documentId: ${req.documentId}`);
        }
        await axiosInstance.delete(`/requisitos/${req.documentId}`);
      }

      // Eliminar la VersionRequisito en sí
      console.log(
        `Eliminando Version con documentId: ${versionWrapper.data.data?.[0]?.documentId}`
      );

      await axiosInstance.delete(
        `/version-requisitos/${versionWrapper.data.data?.[0]?.documentId}`
      );

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `✔️ VersionRequisito y ${requisitos.length} Requisitos eliminados correctamente`
        );
      }
    } catch (error) {
      handleAxiosError(error);
    }
  },
};
