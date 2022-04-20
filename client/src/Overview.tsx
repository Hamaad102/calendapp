import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Context
import { AuthProvider } from './context/useAuthContext';
import { ProfileProvider } from './context/useProfileContext';

// MUI
import theme from './themes/theme';
import { ThemeProvider } from '@mui/material';

function Overview(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default Overview;
