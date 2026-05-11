"use client";

import { useCallback, useMemo, useState } from "react";
import { VersionRequisito } from "@/types";
import {
  RequisitoTableColumnKey,
  SortOrder,
  sortVersionRequisitos,
} from "@/components/appComponents/shared/requisitos/versionRequisitoTableSort";

export function useRequisitosTableSortAndSelection(
  data: VersionRequisito[],
  onDeleteMultiple?: (requisitos: VersionRequisito[]) => void
) {
  const [sortColumn, setSortColumn] = useState<RequisitoTableColumnKey>("identificador");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selected, setSelected] = useState<string[]>([]);

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

  const allSelected =
    sortedData.length > 0 && sortedData.every((r) => selected.includes(r.documentId));
  const someSelected = sortedData.some((r) => selected.includes(r.documentId)) && !allSelected;

  const handleToggle = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const handleToggleAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      const allIds = sortedData.map((r) => r.documentId);
      setSelected(checked ? allIds : []);
    },
    [sortedData]
  );

  const handleDeleteSelected = useCallback(() => {
    const itemsToDelete = data.filter((r) => selected.includes(r.documentId));
    onDeleteMultiple?.(itemsToDelete);
    setSelected([]);
  }, [data, selected, onDeleteMultiple]);

  return {
    sortedData,
    sortColumn,
    sortOrder,
    toggleSort,
    selected,
    handleToggle,
    handleToggleAll,
    handleDeleteSelected,
    allSelected,
    someSelected,
  };
}
