// Las funciones definidas para el manejo de la entidad Requisito (CRUD) involucran el acceso a VersionRequisito, que 
// es el punto de conexión entre Proyecto y Requisito, y maneja los cambios de veriones históricas de los requisitos.

import axiosInstance from "@/lib/axios";
import axios from "axios";
import { VersionRequisito, Requisito, CorreccionSimulada} from "@/types/entities";
import { checkIsAnalista , getCurrentUser} from "@/hooks/auth/auth";
import { proyectoService } from "./proyecto-service";

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

export const requisitoService = {
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
  async updateRequisito(versionRequisitoId: number, requisito: Omit<Requisito, "id" | "idVersionado" | "esVersionActiva">,):
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
    },

  // Eliminar VersionRequisito, con sus Requisitos asociados
  async deleteRequisito(id: number): Promise<void> {
    if (!(await checkIsAnalista())) {
      throw new Error("No tienes permisos para eliminar versiones de requisitos")
    }

    // 1. Se obtiene todos los requisitos asociados a esta VersionRequisito
    const requisitosResponse = await axiosInstance.get<{ data: Requisito[] }>(`/requisitos`, {
      params: {
        filters: {
          idVersionado: {
            id: {
              $eq: id,
            },
          },
        },
      },
    });
    
    // 2. Se elimina cada requisito asociado
    for (const requisito of requisitosResponse.data.data) {
      await axiosInstance.delete(`/requisitos/${requisito.id}`)
    }
  
    // 3. Se elimina la VersionRequisito
    await axiosInstance.delete(`/version-requisitos/${id}`)
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


  
};