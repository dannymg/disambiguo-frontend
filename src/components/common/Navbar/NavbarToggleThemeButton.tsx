// Componente alternativo: ToggleThemeButton.tsx
import { Switch, Typography, Box } from "@mui/material";
import { useThemeMode } from "@/styles/theme/ThemeContext";

export default function NavbarToggleThemeButton() {
  const { isDarkMode, toggleTheme } = useThemeMode();

  return (
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Typography variant="body2" sx={{ mr: 1 }}>
        Modo Noche
      </Typography>
      <Switch checked={isDarkMode} onChange={toggleTheme} color="secondary" />
    </Box>
  );
}
