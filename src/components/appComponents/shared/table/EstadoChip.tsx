"use client";

import { Chip } from "@mui/material";
import { estadoConfig } from "../requisitos/estadoRevision";

interface Props {
  estado?: string;
}

export default function EstadoChip({ estado }: Props) {
  const config = estado ? estadoConfig[estado as keyof typeof estadoConfig] : undefined;

  return (
    <Chip label={config?.label} color={config?.color || "default"} size="small" variant="filled" />
  );
}
