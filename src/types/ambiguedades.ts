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
