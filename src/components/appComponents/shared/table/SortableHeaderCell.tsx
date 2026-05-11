"use client";

import { Box, IconButton, TableCell, Tooltip } from "@mui/material";
import { ArrowDropDown, ArrowDropUp, UnfoldMore } from "@mui/icons-material";
import {
  RequisitoTableColumnKey,
  SortOrder,
} from "@/components/appComponents/shared/requisitos/versionRequisitoTableSort";

interface Props {
  label: string;
  columnKey: RequisitoTableColumnKey;
  width: string;
  sortColumn: RequisitoTableColumnKey;
  sortOrder: SortOrder;
  onToggleSort: (key: RequisitoTableColumnKey) => void;
  wrapWords?: boolean;
}

export default function SortableHeaderCell({
  label,
  columnKey,
  width,
  sortColumn,
  sortOrder,
  onToggleSort,
  wrapWords = false,
}: Props) {
  return (
    <TableCell sx={{ width, ...(wrapWords ? { overflowWrap: "break-word" } : undefined) }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {label}
        <Tooltip title={`Ordenar por ${label}`}>
          <IconButton
            size="small"
            onClick={() => onToggleSort(columnKey)}
            sx={{ borderRadius: 1, p: 0.2 }}>
            {sortColumn === columnKey ? (
              sortOrder === "asc" ? (
                <ArrowDropUp fontSize="small" />
              ) : (
                <ArrowDropDown fontSize="small" />
              )
            ) : (
              <UnfoldMore fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </TableCell>
  );
}
