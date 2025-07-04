//Entidades para el manejo de los Proyectos
import { VersionRequisito } from "./requisitos";
import { User } from "./users";

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
  usuarios: User[]; //Arreglo de usuarios relacionados
  listaRequisitos: VersionRequisito[];
  creadoPor: string; // email
  createdAt?: string; // Opcional
  updatedAt?: string; // Opcional
}

export interface ProyectoCreate {
  titulo: string;
  descripcion: string;
  contexto: string;
  objetivo: string;
  palabrasClave: string[];
  version: number;
  esActivo: boolean;
  listaRequisitos: VersionRequisito[];
  creadoPor: string;
}

export interface ProyectoUpdate {
  titulo: string;
  descripcion: string;
  contexto: string;
  objetivo: string;
  palabrasClave: string[];
  version: number;
}
