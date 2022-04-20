import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme();

const unresponsivefont = createTheme({
  typography: {
    fontFamily: '"Open Sans", "sans-serif", "Roboto"',
    fontSize: 12,
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
    h1: {
      fontWeight: 700,
      fontSize: '1.8rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1rem',
    },
    h4: {
      fontWeight: 300,
      fontSize: '0.9rem',
    },
  },
  palette: {
    background: {
      default: '#ffffff',
    },
    primary: { main: '#f76900', light: '#ffffff' },
    secondary: { main: '#000000', light: 'grey' },
  },
  shape: {
    borderRadius: 5,
  },
});

theme = responsiveFontSizes(unresponsivefont);

export default theme;
