import { Proyecto, ProyectoCreate, ProyectoUpdate } from "@/types";
import { mockUser } from "./user.mock";

export const mockProyecto: Proyecto = {
  id: 1,
  documentId: "PROY-001",
  titulo: "Proyecto de prueba",
  descripcion: "Descripción del proyecto",
  contexto: "Contexto educativo",
  objetivo: "Objetivo general",
  palabrasClave: ["educación", "software"],
  version: 1,
  esActivo: true,
  usuarios: [mockUser],
  listaRequisitos: [],
  creadoPor: mockUser.email,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

export const mockProyectoCreate: ProyectoCreate = {
  titulo: "Nuevo proyecto",
  descripcion: "Creación de un nuevo proyecto",
  contexto: "Simulación de prueba",
  objetivo: "Validar comportamiento",
  palabrasClave: ["nuevo", "jest"],
  version: 1,
  esActivo: true,
  listaRequisitos: [],
  creadoPor: mockUser.email,
};

export const mockProyectoUpdate: ProyectoUpdate = {
  titulo: "Proyecto actualizado",
  descripcion: "Actualización de contenido",
  contexto: "Contexto modificado",
  objetivo: "Mejorar funcionalidad",
  palabrasClave: ["actualizado", "test"],
  version: 2,
};
