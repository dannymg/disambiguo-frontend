import { Ambiguedad, Correccion } from "@/types";

export const mockAmbiguedad: Ambiguedad = {
  id: 1,
  documentId: "AMB-001",
  nombre: "Ambigüedad Léxica",
  explicacion: "Uso de palabras imprecisas como 'rápidamente' o 'eficiente'",
  tipoAmbiguedad: "LÉXICA",
  correcciones: [], // se llena luego
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const mockCorreccion: Correccion = {
  id: 1,
  documentId: "CORR-001",
  textoGenerado: "El sistema debe responder en menos de 2 segundos.",
  esAceptada: false,
  esModificada: false,
  comentarioModif: "",
  idAmbiguedad: mockAmbiguedad,
  creadoPor: "analista@unl.edu.ec",
  modificadoPor: "",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

// Enlace inverso (opcional)
mockAmbiguedad.correcciones = [mockCorreccion];

export const mockCorreccionCreate = {
  textoGenerado: "Debe enviar un correo en menos de 5 segundos.",
  esAceptada: false,
  esModificada: false,
  comentarioModif: "",
  idAmbiguedad: mockAmbiguedad,
  creadoPor: "analista@unl.edu.ec",
};

export const mockCorreccionModif = {
  textoGenerado: "Debe enviar un correo inmediatamente después del registro.",
  esModificada: true,
  comentarioModif: "Se especificó el momento del envío.",
  modificadoPor: "analista@unl.edu.ec",
};
