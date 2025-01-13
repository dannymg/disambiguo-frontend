// Interfaces para las entidades principales
export interface User {
  id: number;
  document_id: string;
  username: string;
  email: string;
  provider: string;
  password?: string;
  reset_password_token?: string | null;
  confirmation_token?: string | null;
  confirmed?: boolean;
  blocked?: boolean;
  role?: Role; // Verificar los campos necesarios
  proyectos?: Proyecto[];
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  document_id: string;
  name: string;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleLink {
  id: number;
  user_id: number;
  role_id: number;
  user_ord: number;
}

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
  createdAt: string;
  updatedAt: string;
}

export interface VersionRequisito {
  id: number;
  requisitos: Requisito[];
  identificador: string;
  numeroID: number;
  tipo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Requisito {
  id: number;
  nombre: string;
  descripcion: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  version: number;
  esVersionActiva: boolean;
  estadoRevision: 'PENDIENTE' | 'EN_REVISION' | 'REVISADO';
  ambiguedad: Ambiguedad[];
  idVersionado: VersionRequisito;
  creadoPor: string; // email
  createdAt: string;
  updatedAt: string;
}

export interface Ambiguedad {
  id: number;
  nombre: string;
  descripcion: string;
  explicacion: string;
  tipoAmbiguedad: string;
  correcciones: Correccion[];
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}