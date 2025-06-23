// Las funciones definidas para el manejo de la entidad Requisito (CRUD) involucran el acceso a VersionRequisito, que 
// es el punto de conexión entre Proyecto y Requisito, y maneja los cambios de veriones históricas de los requisitos.

import axiosInstance from "@/lib/axios";
import axios from "axios";
import { VersionRequisito, Requisito, CorreccionSimulada} from "@/types/entities";
import { checkIsAnalista , getCurrentUser} from "@/hooks/auth/auth";
import { proyectoService } from "./proyectoService";

interface CreateRequisitoData {
  numeroID: number;
  tipo: "FUNCIONAL" | "NO_FUNCIONAL";
  nombre: string;
  descripcion: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  version: number;
  estadoRevision: string;
  creadoPor: string;
}

interface UpdateRequisitoData {
  nombre: string;
  tipo?: "FUNCIONAL" | "NO_FUNCIONAL";
  descripcion: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  version?: number;
  estadoRevision: 'PENDIENTE' | 'AMBIGUO' | 'CORREGIDO' | 'NO_CORREGIDO' | 'NO_AMBIGUO' | 'VALIDADO';
  modificadoPor?: string;
  creadoPor: string; // este puede mantenerse para trazabilidad
}


export const requisitoService = {
  async actualizarEstadoRevision(identificador: string, proyectoId: string, nuevoEstado: string) {
    try {
      // 1. Obtener la versión activa
      const version = await this.getRequisitoByIdentificador(proyectoId, identificador);
      const requisitoActivo = version?.requisito?.[0];

      if (!requisitoActivo || !requisitoActivo.documentId) {
        throw new Error("No se encontró requisito activo para el identificador proporcionado.");
      }

      // 2. Actualizar su estado de revisión
      const response = await axiosInstance.put(`/requisitos/${requisitoActivo.documentId}`, {
        data: {
          estadoRevision: nuevoEstado,
        },
      });

      console.log(`🔄 Estado de revisión actualizado a ${nuevoEstado} para ${identificador}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar estado de revisión:", error);
      throw error;
    }
  },

  // Obtener todos los requisitos de un proyecto manejados por "VersionRequisito"
  async getAllRequisitos(proyectoId: string): Promise<VersionRequisito[]> {
    const response = await axiosInstance.get<{ data: VersionRequisito[] }>(`/version-requisitos`, { 
        params: {
        filters: {
            proyecto: {
            documentId: {
                $eq: proyectoId,
            },
            },
        },
        populate: {
            requisito: {
            filters: {
                esVersionActiva: {
                $eq: true,
                },
            },
            },
            proyecto: true, // Cargar el campo proyecto en la respuesta
        },
        },
    });
    return response.data.data
  },

  async getAllRequisitosByIdentificador(
    identificador: string,
    proyectoId: string
  ): Promise<Requisito[]> {
    const { data } = await axiosInstance.get<{ data: VersionRequisito[] }>(
      '/version-requisitos',
      {
        params: {
          filters: {
            identificador: { $eq: identificador },
            proyecto: {
              documentId: { $eq: proyectoId },
            },
          },
          populate: {
            requisito: true,
          },
        },
      }
    );

    return data.data?.[0]?.requisito || [];
  },

  async getRequisitoByIdentificador(proyectoId: string, identificador: string): Promise<VersionRequisito | null> {
    console.log("Buscando requisito por proyecto:", proyectoId);
    console.log("Buscando requisito por identificador:", identificador);
    const response = await axiosInstance.get<{ data: VersionRequisito[] }>('/version-requisitos', {
      params: {
        filters: {
          proyecto: {
            documentId: {
              $eq: proyectoId,
            },
          },
          identificador: {
            $eq: identificador,
          },
        },
        populate: {
          requisito: {
            filters: {
              esVersionActiva: {
                $eq: true,
              },
            },
          },
          proyecto: true,
        },
        pagination: {
          limit: 1, // Solo queremos uno
        },
      },
    });

    const resultado = response.data.data?.[0];
    console.log("Requisito encontrado por identificador:", resultado);
    return resultado || null;
  },




  // Obtener un requisito por ID
  async getRequisitoById(id: number): Promise<VersionRequisito[]> {
    const response = await axiosInstance.get<{ data: VersionRequisito[] }>(`/version-requisitos/${id}`, {
      params: {
        populate: {
          requisito: {
            filters: {
              esVersionActiva: {
                $eq: true,
              },
            },
          },
          proyecto: true,
        },
      },
    });
    return response.data.data
  },

  // Crear nueva VersionRequisito, con su Requisito asociado
  async createRequisito(requisitoData: CreateRequisitoData, proyectoId: string): Promise<VersionRequisito> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para crear requisitos")
    }
    try {
      const currentUser = await getCurrentUser();
      console.log("Usuario actual:", currentUser.email);

      const currentProject = await proyectoService.getProyectoById(proyectoId);
      if (!currentProject) {
        throw new Error("El proyecto no existe");
      }
      console.log("Proyecto actual:", currentProject);
      

      const paddedNumeroID = String(requisitoData.numeroID).padStart(3, "0");
      // Generar identificador RF-{numeroID} o RNF-{numeroID}
      const identificador = requisitoData.tipo === "FUNCIONAL" ? `RF-${paddedNumeroID}` : `RNF-${paddedNumeroID}`;
      console.log("Identificador generado:", identificador);

      const versionResponse = await axiosInstance.post<{ data: VersionRequisito }>("/version-requisitos", {
        data: {
          numeroID: requisitoData.numeroID,
          tipo: requisitoData.tipo,
          identificador: identificador,
          proyecto: currentProject.id,
        }
      });
      
      const versionRequisito = versionResponse.data.data;
      console.log("VersionRequisito creado:", versionRequisito);

      const requisitoResponse = await axiosInstance.post<{ data: Requisito }>("/requisitos", {
        data: {
          nombre: requisitoData.nombre,
          descripcion: requisitoData.descripcion,
          prioridad: requisitoData.prioridad,
          version: requisitoData.version,
          idVersionado: {  
            connect: [versionRequisito.id] 
          },
          esVersionActiva: true,
          estadoRevision: requisitoData.estadoRevision,
          creadoPor: currentUser.email,
        }
      });

      const requisito = requisitoResponse.data.data;
      console.log("Requisito creado:", requisito);

      return versionRequisito;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creando requisito:", error.response?.data);
      } else {
        console.error("Error desconocido:", error);
      }
      throw error;
    }
  },

  // Crear nuevo requisito y desactivar la versión actual
  async updateRequisito(
    versionRequisitoId: string,
    requisitoData: UpdateRequisitoData
  ): Promise<Requisito> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para crear nuevas versiones de requisitos");
    }

    try {
      // 🔹 1. Obtener el requisito activo de la versión actual
      console.log("Obteniendo requisito activo para la versión:", versionRequisitoId);
    // 1. Obtener la versión con su requisito activo por documentId
      const { data: versionWrapper } = await axiosInstance.get<{ data: VersionRequisito[] }>(
        `/version-requisitos`,
        {
          params: {
            filters: {
              documentId: { $eq: versionRequisitoId },
            },
            populate: {
              requisito: {
                filters: {
                  esVersionActiva: { $eq: true }
                }
              }
            }
          }
        }
      );
      console.log("Versión obtenida:", versionWrapper);

      const version = versionWrapper.data?.[0];
      const activo = version?.requisito?.[0];

      console.log("Requisito activo encontrado:", activo);
      // Verificar si existe un requisito activo
      if (!activo) {
        throw new Error("No se encontró requisito activo para esta versión");
      }

      console.log("Desactivando:", activo);
      // 🔹 2. Desactivar el requisito actual
      await axiosInstance.put(`/requisitos/${activo.documentId}`, {
        data: { esVersionActiva: false },
      });

      // 🔹 3. Obtener usuario actual
      const user = await getCurrentUser();

      // Version máxima para asignar
      const { data: allVersionWrapper } = await axiosInstance.get<{ data: VersionRequisito[] }>(
        `/version-requisitos`,
        {
          params: {
            filters: {
              documentId: { $eq: versionRequisitoId },
            },
            populate: {
              requisito: true // sin filtro, trae todas las versiones
            }
          }
        }
      );

      const todasLasVersiones = allVersionWrapper.data?.[0]?.requisito || [];
      const maxVersion = Math.max(...todasLasVersiones.map((r) => r.version ?? 0));

      console.log("Máxima versión encontrada:", maxVersion);

      // 🔹 4. Crear nuevo requisito
      const nuevoRequisito = {
        nombre: requisitoData.nombre,
        tipo: requisitoData.tipo,
        descripcion: requisitoData.descripcion,
        prioridad: requisitoData.prioridad,
        version: maxVersion + 1,
        estadoRevision: requisitoData.estadoRevision,
        esVersionActiva: true,
        creadoPor: requisitoData.creadoPor || activo.creadoPor,
        modificadoPor: user.email,
        idVersionado: { connect: [version.id] },
      };

      console.log("Creando nuevo requisito con datos:", nuevoRequisito);

      const { data: result } = await axiosInstance.post<{ data: Requisito }>(`/requisitos`, {
        data: nuevoRequisito,
      });

      console.log("Nuevo requisito creado:", result.data);
      return result.data;
    } catch (err) {
      console.error('Error al actualizar requisito:', err);
      throw err;
    }
  },

  //   async deleteRequisitoByIdentificador(proyectoId: string, identificador: string): Promise<VersionRequisito | null> {
  // },



  // Eliminar VersionRequisito, con sus Requisitos asociados
  async deleteRequisitoYVersiones(versionRequisitoId: string): Promise<void> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para eliminar versiones de requisitos")
    }

  try {
    // 1. Buscar la versión por documentId y obtener su ID numérico y requisitos asociados
    console.log("Buscando versión por documentId:", versionRequisitoId);
    const { data: versionWrapper} = await axiosInstance.get<{ data: VersionRequisito [] }>('/version-requisitos', {
        params: {
          filters: {
            documentId: { $eq: versionRequisitoId },
          },
          populate: {
            requisito: true, // obtener todos los requisitos asociados
          },
        },
      });

      console.log("Versión obtenida:", versionWrapper);


      const requisitos = versionWrapper.data?.[0]?.requisito || [];
      console.log(`Requisitos asociados encontrados`, requisitos);

      // 2. Eliminar cada requisito asociado
      for (const req of requisitos) {
        console.log(`Eliminando requisito con ID: ${req.documentId}`);
        await axiosInstance.delete(`/requisitos/${req.documentId}`);
      }

      // 3. Eliminar la versión en sí
      console.log(`Eliminando versión con documentId: ${versionWrapper.data?.[0]?.documentId}`);
      await axiosInstance.delete(`/version-requisitos/${versionWrapper.data?.[0]?.documentId}`);
    
      console.log(`Versión y ${requisitos.length} requisitos eliminados correctamente`);
    } catch (error) {
      console.error("Error al eliminar versión y requisitos asociados:", error);
      throw error;
    }
  },

  async setVersionActiva(requisitoId: string, identificador: string): Promise<void> {
    try {
      // 🔹 Obtener todas las versiones del requisito por identificador
      const response = await axiosInstance.get<{ data: VersionRequisito[] }>('/version-requisitos', {
        params: {
          filters: {
            identificador: {
              $eq: identificador,
            },
          },
          populate: ['requisito'],
        },
      });

      const versiones = response.data.data;

      // 🔹 Desactivar todas las versiones
      await Promise.all(
        versiones.flatMap((vr) =>
          (vr.requisito || []).map((r) =>
            axiosInstance.put(`/requisitos/${r.documentId}`, {
              data: { esVersionActiva: false },
            })
          )
        )
      );

      // 🔹 Activar la versión seleccionada
      await axiosInstance.put(`/requisitos/${requisitoId}`, {
        data: { esVersionActiva: true },
      });
    } catch (error) {
      console.error('Error al actualizar la versión activa:', error);
      throw error;
    }
},
















  // Detección simulada de ambigüedades en frontend (ISO 29148)
  async detectarAmbiguedades(proyectoId: string, requisitosIds: string[]) {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para detectar ambigüedades");
    }

    const response = await axiosInstance.get<{ data: VersionRequisito[] }>(`/version-requisitos`, {
      params: {
        filters: {
          documentId: { $in: requisitosIds },
          proyecto: {
            documentId: { $eq: proyectoId },
          },
        },
        populate: {
          requisito: {
            filters: {
              esVersionActiva: {
                $eq: true,
              },
            },
            populate: ["ambiguedad"],
          },
          proyecto: true,
        },
      },
    });

    console.log("🔍 Respuesta de requisitos:", response.data.data);

    const patronesAmbiguos = [
      "mejor", "fácil", "adecuado", "mínimo", "óptimo",
      "eficiente", "seguro", "confiable", "ideal"
    ];

    const analizados = response.data.data.map((req) => {
      const texto = req.requisito?.[0]?.descripcion?.toLowerCase() ?? "";
      const encontrado = patronesAmbiguos.find((p) => texto.includes(p));
      const ambiguedadesPrevias = req.requisito?.[0]?.ambiguedad ?? [];

      console.log("📌 Requisito:", req.identificador);
      console.log("➡️ Descripción:", texto);
      console.log("⚠️ Ambigüedad detectada:", encontrado);
      console.log("🧠 Ambigüedades existentes:", ambiguedadesPrevias);

      return {
        documentId: req.documentId,
        identificador: req.identificador,
        nombre: req.requisito?.[0]?.nombre,
        descripcion: req.requisito?.[0]?.descripcion,
        ambiguedad: encontrado
          ? `Ambigüedad ISO-29148: uso del término impreciso \"${encontrado}\"`
          : null,
        corregir: !!encontrado,
        ambiguedadesPrevias,
      };
    });

    return analizados;
  },

// Generación de correcciones simuladas basada en requisitos activos
async generarCorrecciones(proyectoId: string, requisitosIds: string[]): Promise<CorreccionSimulada[]> {
  if (!(await checkIsAnalista())) {
    throw new Error("No tienes permisos para generar correcciones");
  }

  const response = await axiosInstance.get<{ data: VersionRequisito[] }>(`/version-requisitos`, {
    params: {
      filters: {
        documentId: { $in: requisitosIds },
        proyecto: {
          documentId: { $eq: proyectoId },
        },
      },
      populate: {
        requisito: {
          filters: {
            esVersionActiva: {
              $eq: true,
            },
          },
          populate: ["ambiguedad"],
        },
        proyecto: true,
      },
    },
  });

  console.log("📘 Requisitos obtenidos para corrección:", response.data.data);

  const resultado: CorreccionSimulada[] = response.data.data.map((req) => {
    const r = req.requisito?.[0];
    const descripcion = r?.descripcion ?? "Sin descripción";
    const identificador = req.identificador ?? "Sin ID";
    const requisitoId = req.documentId;

    return {
      requisitoId,
      identificador,
      descripcion,
      tipoAmbiguedad: "Ambigüedad léxica",
      explicacion: `La ambigüedad se presenta en la frase: "${descripcion}". Esto se debe a que contiene términos vagos según ISO 29148.`,
      correcciones: [
        { texto: `${descripcion} [Corrección 1]`, esModificada: false },
        { texto: `${descripcion} [Corrección 2]`, esModificada: false },
        { texto: `${descripcion} [Corrección 3]`, esModificada: false },
      ],
    };
  });

  console.log("✅ Correcciones generadas:", resultado);
  return resultado;
}



  // async getAllIDs(proyectoId: string): Promise<string[]> {
  // const versiones = await requisitoService.getAllRequisitos(proyectoId);
  // const identificadores = versiones
  //   .flatMap((version) =>
  //     version.requisito?.map((req) => version.identificador?.toUpperCase()) ?? []
  //   )
  //   .filter((id): id is string => !!id);

  // return [...new Set(identificadores)];
  // },

  
};