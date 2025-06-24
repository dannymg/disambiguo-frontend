import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

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
    <Box sx={{ mt: 3 }} width="50%">
      <Typography variant="subtitle1" gutterBottom>
        Palabras clave *
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Describe elementos clave del sistema"
          helperText="Ejemplos: Ventas, Inventario, Receta médica, Paciente, etc."
          value={newKeyword}
          onChange={(e) => onChangeNewKeyword(e.target.value)}
        />
        <IconButton color="primary" onClick={onAddKeyword}>
          <AddIcon />
        </IconButton>
      </Box>
      <List>
        {keywords.map((keyword, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => onRemoveKeyword(index)}>
                <DeleteIcon />
              </IconButton>
            }>
            <ListItemText primary={keyword} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
