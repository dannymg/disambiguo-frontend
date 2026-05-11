import { Box, Typography, TextField, IconButton, Chip, Stack } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface Props {
  keywords: string[];
  newKeyword: string;
  onChangeNewKeyword: (value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
}

export default function ProyectoCrearKeywords({
  keywords,
  newKeyword,
  onChangeNewKeyword,
  onAddKeyword,
  onRemoveKeyword,
}: Props) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Palabras clave *
      </Typography>

      {/* INPUT */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Palabras clave del Proyecto"
          value={newKeyword}
          onChange={(e) => onChangeNewKeyword(e.target.value)}
        />

        <IconButton
          color="primary"
          onClick={onAddKeyword}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* CHIPS */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {keywords.map((keyword, index) => (
          <Chip
            key={index}
            label={keyword}
            onDelete={() => onRemoveKeyword(index)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>
    </Box>
  );
}
