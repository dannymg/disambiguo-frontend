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
  titulo: string;
  descripcion: string;
  contexto: string;
  listaEspecificaciones: any; // JSON type
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
  requisito: Requisito[];
  identificador: string;
  numeroID: number;
  tipo: string;
  proyecto: Proyecto;
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface Requisito {
  id: number;
  nombre: string;
  descripcion: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  version: number;
  esVersionActiva: boolean;
  estadoRevision: 'PENDIENTE' | 'EN_REVISION' | 'REVISADO' | 'AMBIGUO' | 'NO_AMBIGUO';
  ambiguedad: Ambiguedad[];
  idVersionado: VersionRequisito;
  creadoPor: string; // email
  modificadoPor: string; // email
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface Ambiguedad {
  id: number;
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

