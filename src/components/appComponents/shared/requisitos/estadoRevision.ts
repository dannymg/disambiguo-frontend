export type EstadoRevision =
  | "NO_REVISADO"
  | "AMBIGUO"
  | "NO_AMBIGUO"
  | "CORREGIDO"
  | "MODIFICADO"
  | "NO_VALIDADO"
  | "VALIDADO";

export const estadoConfig: Record<
  EstadoRevision,
  {
    label: string;
    color: "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info";
  }
> = {
  NO_REVISADO: {
    label: "No revisado",
    color: "default",
  },
  AMBIGUO: {
    label: "Ambiguo",
    color: "warning",
  },
  NO_AMBIGUO: {
    label: "No ambiguo",
    color: "success",
  },
  CORREGIDO: {
    label: "Corregido",
    color: "info",
  },
  MODIFICADO: {
    label: "Modificado",
    color: "secondary",
  },
  NO_VALIDADO: {
    label: "No validado",
    color: "error",
  },
  VALIDADO: {
    label: "Validado",
    color: "success",
  },
};
