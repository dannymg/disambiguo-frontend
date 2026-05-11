"use client";

import { Box, Button } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface Props {
  disabled: boolean;
  onDeleteSelected: () => void;
}

export default function RequisitosTableBulkToolbar({ disabled, onDeleteSelected }: Props) {
  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={onDeleteSelected}
        disabled={disabled}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          px: 2.5,
          py: 1,
          fontWeight: 500,
          transition: "0.2s",
          "&:hover": {
            backgroundColor: "rgba(220,38,38,0.08)",
          },
        }}>
        Eliminar seleccionados
      </Button>
    </Box>
  );
}
