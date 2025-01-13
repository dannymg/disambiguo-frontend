import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#03A9F4',
      light: '#67DAFF',
      dark: '#0288D1',
      contrastText: '#ffffff',
    },
    background: {
      default: 'linear-gradient(to right, #ECE9E6, #FFFFFF)', // Degradado global
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
