"use client";

import { useCallback, useMemo, useState } from "react";
import { VersionRequisito } from "@/types";
import {
  RequisitoTableColumnKey,
  SortOrder,
  sortVersionRequisitos,
} from "@/components/appComponents/shared/requisitos/versionRequisitoTableSort";

export function useRequisitosSeleccionablesSort(data: VersionRequisito[]) {
  const [sortColumn, setSortColumn] = useState<RequisitoTableColumnKey>("identificador");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const seleccionables = useMemo(
    () => data.filter((r) => r.requisito?.[0]?.estadoRevision !== "VALIDADO"),
    [data]
  );

  const sortedData = useMemo(
    () => sortVersionRequisitos(data, sortColumn, sortOrder),
    [data, sortColumn, sortOrder]
  );

  const toggleSort = useCallback(
    (column: RequisitoTableColumnKey) => {
      if (sortColumn === column) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortOrder("asc");
      }
    },
    [sortColumn]
  );

  return { seleccionables, sortedData, sortColumn, sortOrder, toggleSort };
}
