// ThemeContext.tsx
import { createContext, useContext, useState, useMemo, useEffect } from 'react'; // Importa useEffect
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'; // Importa ThemeProvider de Material-UI
import CssBaseline from '@mui/material/CssBaseline'; // Para resetear estilos globales
import { lightTheme, darkTheme } from '@/styles/theme/theme';

// Crear el contexto del tema
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Hook personalizado para usar el contexto del tema
export const useThemeContext = () => useContext(ThemeContext);

// Proveedor del tema
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cargar el tema desde localStorage al inicializar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Función para alternar entre los modos claro y oscuro
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Guardar el tema en localStorage
      return newMode;
    });
  };

  // Seleccionar el tema basado en el estado
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Resetear estilos globales */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}