"use client";
import { ThemeProvider as MuiProvider, CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { useThemeMode } from "./ThemeContext";
import { lightTheme, darkTheme } from "./theme";

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useThemeMode();
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <MuiProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiProvider>
  );
};
