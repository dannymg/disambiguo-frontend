import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: { mode: "light" },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { height: "100%", margin: 0, padding: 0 },
        body: {
          height: "100%",
          margin: 0,
          padding: 0,
          background: "linear-gradient(to right, #ECE9E6, #FFFFFF)",
        },
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        ".fade-in": {
          animation: "fadeIn 1.5s ease-in-out",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: { mode: "dark" },
});
