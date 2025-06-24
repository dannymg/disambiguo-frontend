// Interfaces para las principales entidades
// ==============Entidades de Strapi=============
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: Role;
  proyectos?: Proyecto[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// ==============Entidades de la aplicación=============
export interface Proyecto {
  id: number;
  documentId: string; // Identificador único
  titulo: string;
  descripcion: string;
  contexto: string;
  objetivo: string;
  palabrasClave: string[]; // JSON type
  version: number;
  esActivo: boolean;
  usuarios: User[];
  listaRequisitos: VersionRequisito[];
  creadoPor: string; // email
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export type ProyectoCreate = Partial<Proyecto>;
export type ProyectoUpdate = Partial<Proyecto>;

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

export interface CreateRequisitoData {
  numeroID: number;
  tipo: "FUNCIONAL" | "NO_FUNCIONAL";
  nombre: string;
  descripcion: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  version: number;
  estadoRevision: string;
  creadoPor: string;
}

export interface UpdateRequisitoData {
  nombre: string;
  tipo?: "FUNCIONAL" | "NO_FUNCIONAL";
  descripcion: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  version?: number;
  estadoRevision:
    | "PENDIENTE"
    | "AMBIGUO"
    | "CORREGIDO"
    | "NO_CORREGIDO"
    | "NO_AMBIGUO"
    | "VALIDADO";
  modificadoPor?: string;
  creadoPor: string; // este puede mantenerse para trazabilidad
}

export interface Ambiguedad {
  id: number;
  documentId: string; // Identificador único
  nombre: string;
  // descripcion: string;
  explicacion: string;
  tipoAmbiguedad: string;
  correcciones?: Correccion[];
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface Correccion {
  id?: number;
  documentId?: string; // Identificador único
  textoGenerado: string;
  esAceptada: boolean;
  esModificada: boolean;
  comentarioModif: string;
  idAmbiguedad: Ambiguedad;
  creadoPor: string; // email
  modificadoPor?: string; // email
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface CorreccionCreate {
  textoGenerado: string;
  esAceptada: boolean;
  esModificada: boolean;
  comentarioModif: string;
  idAmbiguedad: Ambiguedad;
  creadoPor: string; // email
  modificadoPor?: string; // email
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface CorreccionModif {
  textoGenerado: string;
  esModificada: boolean;
  comentarioModif: string;
  modificadoPor: string; // email
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface CorreccionSimulada {
  requisitoId: string;
  identificador: string;
  descripcion: string;
  tipoAmbiguedad: string;
  explicacion: string;
  correcciones: {
    texto: string;
    esModificada: boolean;
  }[];
}
