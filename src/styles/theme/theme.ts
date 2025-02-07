// theme.ts
import { createTheme } from '@mui/material/styles';

// Tema Claro
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0E64C7',
      light: '#73A8FF',
      dark: '#004BB5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6C757D',
      light: '#B0BEC5',
      dark: '#4F5B62',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F5F5', // Fondo claro
      paper: '#F5F5F5',   // Fondo de papel claro
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '3rem', fontWeight: 600 },
    h2: { fontSize: '2.5rem', fontWeight: 500 },
    h3: { fontSize: '2rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    button: { textTransform: 'none' },
  },
});

// Tema Oscuro
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9',
      light: '#E3F2FD',
      dark: '#42A5F5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#B0BEC5',
      light: '#CFD8DC',
      dark: '#78909C',
      contrastText: '#000000',
    },
    background: {
      default: '#2C2C2C', // Fondo oscuro (gris oscuro)
      paper: '#2C2C2C',   // Fondo de papel oscuro (gris medio)
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '3rem', fontWeight: 600 },
    h2: { fontSize: '2.5rem', fontWeight: 500 },
    h3: { fontSize: '2rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    button: { textTransform: 'none' },
  },
});