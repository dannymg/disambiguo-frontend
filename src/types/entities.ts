// Interfaces para las entidades principales
export interface User {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    role: number;   // De acuerdo al .env: STRAPI_ID_ROL_ANALISTA
    proyectos: Proyecto[];
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
  