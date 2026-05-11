"use client";

import { Chip } from "@mui/material";

type Prioridad = "ALTA" | "MEDIA" | "BAJA";

const prioridadConfig: Record<
  Prioridad,
  {
    label: string;
    color: "error" | "warning" | "info";
  }
> = {
  ALTA: {
    label: "Alta",
    color: "error",
  },
  MEDIA: {
    label: "Media",
    color: "warning",
  },
  BAJA: {
    label: "Baja",
    color: "info",
  },
};

interface Props {
  prioridad?: string;
}

export default function PrioridadChip({ prioridad }: Props) {
  const config = prioridad ? prioridadConfig[prioridad as Prioridad] : undefined;

  return (
    <Chip
      label={config?.label || "Sin prioridad"}
      color={config?.color || "default"}
      size="small"
      variant="filled"
    />
  );
}
