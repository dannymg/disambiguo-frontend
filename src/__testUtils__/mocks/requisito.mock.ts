import { Requisito, VersionRequisito } from "@/types";
import { mockProyecto } from "./proyecto.mock";
import { mockAmbiguedad } from "./ambiguedad.mock";

export const mockVersionRequisito: VersionRequisito = {
  id: 10,
  documentId: "VER-001",
  identificador: "RF-001",
  numeroID: 1,
  tipo: "FUNCIONAL",
  proyecto: mockProyecto,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  requisito: [],
};

export const mockRequisito: Requisito = {
  id: 1,
  documentId: "REQ-001",
  nombre: "Registrar usuario",
  descripcion: "El sistema debe permitir registrar un nuevo usuario",
  prioridad: "ALTA",
  version: 1,
  esVersionActiva: true,
  estadoRevision: "NO_REVISADO",
  idVersionado: mockVersionRequisito,
  creadoPor: "analista@unl.edu.ec",
  modificadoPor: "",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  ambiguedad: mockAmbiguedad,
};

// Relación inversa (VersionRequisito.requisito[])
mockVersionRequisito.requisito = [mockRequisito];
