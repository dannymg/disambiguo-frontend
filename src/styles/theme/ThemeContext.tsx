import { createContext, useContext, useEffect, useState } from "react";

export const ThemeModeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setIsDarkMode(stored === "dark");
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeModeContext.Provider>
  );
};
