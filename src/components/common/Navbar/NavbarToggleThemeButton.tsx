import { Switch, Typography, Box } from "@mui/material";
import { useThemeMode } from "@/styles/theme/ThemeContext";

export default function NavbarToggleThemeButton() {
  const { isDarkMode, toggleTheme } = useThemeMode();

  return (
    <Box sx={{ display: "flex", alignItems: "center", mr: 2, gap: 1 }}>
      <Typography
        variant="body2"
        sx={{
          minWidth: 60,
          textAlign: "right",
          color: "rgba(255,255,255,0.85)",
          display: { xs: "none", sm: "block" },
        }}>
        {isDarkMode ? "Oscuro" : "Claro"}
      </Typography>

      <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#fff",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#fff",
          },
          "& .MuiSwitch-track": {
            backgroundColor: "rgba(255,255,255,0.3)",
          },
        }}
      />
    </Box>
  );
}
