// Interfaces para las entidades principales
export interface Usuario {
  id: number;
  nombreUsuario: string;
  correo: string;
  clave?: string;
  rol?: Rol;
  proyectos?: Proyecto[];
  createdAt: string;
  updatedAt: string;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  esValido: boolean;
  usuario?: Usuario[];
  createdAt: string;
  updatedAt: string;
}

export interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  contexto: string;
  listaEspecificaciones: any; // JSON type
  version: number;
  esActivo: boolean;
  usuarios: Usuario[];
  listaRequisitos: VersionRequisito[];
  creadoPor: string; // email
  createdAt: string;
  updatedAt: string;
}

export interface VersionRequisito {
  id: number;
  requisito: Requisito[];
  identificador: string;
  numeroID: number;
  tipo: string;
  proyecto: Proyecto;
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
  modificadoPor: string; // email
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
  token: string;
  usuario: Usuario;
}

