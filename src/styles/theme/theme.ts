import { createTheme } from "@mui/material/styles";

const baseTypography = {
  fontFamily: "'Inter', 'Roboto', sans-serif",
  h3: { fontWeight: 700 },
  h5: { fontWeight: 600 },
  button: {
    textTransform: "none" as const,
    fontWeight: 500,
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // azul moderno
    },
    secondary: {
      main: "#7c3aed", // morado elegante
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: baseTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#f8fafc",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#a78bfa",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: baseTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#0f172a",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#1e293b",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
