import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
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
      default: 'linear-gradient(to right, #ECE9E6, #FFFFFF)', // Degradado global
      paper: '#ffffff',
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

export default theme;
