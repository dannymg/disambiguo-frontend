// Interfaces para las entidades principales
// Entidades de Strapi
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

// Entidades de la aplicación
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

export interface VersionRequisito {
  id: number;
  documentId: string; // Identificador único
  requisito?: Requisito[];
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
  estadoRevision: "PENDIENTE" | "EN_REVISION" | "REVISADO" | "AMBIGUO" | "NO_AMBIGUO";
  ambiguedad?: Ambiguedad[];
  idVersionado: VersionRequisito;
  creadoPor: string; // email
  modificadoPor?: string; // email
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface Ambiguedad {
  id: number;
  documentId: string; // Identificador único
  nombre: string;
  descripcion: string;
  explicacion: string;
  tipoAmbiguedad: string;
  correcciones: Correccion[];
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface Correccion {
  id: number;
  documentId: string; // Identificador único
  textoGenerado: string;
  esAceptada: boolean;
  esModificada: boolean;
  comentarioModif: string;
  idAmbiguedad: Ambiguedad;
  creadoPor: string; // email
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
