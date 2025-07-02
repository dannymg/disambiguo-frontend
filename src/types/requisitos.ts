import { Proyecto } from "./proyectos";
import { Ambiguedad } from "./ambiguedades";

// ==============Entidades de Versiones=============
export interface VersionRequisito {
  id: number;
  documentId: string; // Identificador único
  requisito?: Requisito[]; //Versiones asociadas al Requisito
  identificador?: string; //Identificador de requisito (Ejemplo: RF-000)
  numeroID: number;
  tipo: "FUNCIONAL" | "NO_FUNCIONAL";
  proyecto?: Proyecto;
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

// ==============Entidades de Requisitos=============
export interface Requisito {
  id: number;
  documentId: string; // Identificador único
  nombre: string;
  descripcion: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  version: number;
  esVersionActiva: boolean;
  estadoRevision:
    | "PENDIENTE"
    | "AMBIGUO"
    | "CORREGIDO"
    | "NO_CORREGIDO"
    | "NO_AMBIGUO"
    | "VALIDADO";
  ambiguedad?: Ambiguedad[];
  idVersionado: VersionRequisito;
  creadoPor: string; // email
  modificadoPor?: string; // email
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export type RequisitoFormData = {
  numeroID: string; // sin padding, tipo string
  tipo: "FUNCIONAL" | "NO_FUNCIONAL";
  nombre: string;
  descripcion: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  version: number;
  estadoRevision: "PENDIENTE" | "AMBIGUO" | "NO_AMBIGUO" | "VALIDADO";
};

// Base común para crear o actualizar Requisitos
export interface RequisitoBase {
  nombre: string;
  descripcion: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  version?: number; // Opcional: se calcula o se establece
  estadoRevision:
    | "PENDIENTE"
    | "AMBIGUO"
    | "CORREGIDO"
    | "NO_CORREGIDO"
    | "NO_AMBIGUO"
    | "VALIDADO";
  creadoPor: string;
  modificadoPor?: string;
}

// Solo se usa en creación inicial
export interface CreateRequisitoData extends RequisitoBase {
  numeroID: number;
  tipo: "FUNCIONAL" | "NO_FUNCIONAL"; // Requerido en creación
}
