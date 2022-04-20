import { useState, useEffect } from 'react';

// Context
import { useAuth } from '../../context/useAuthContext';

// MUI
import { Box, Button, CircularProgress, Container, CssBaseline, Paper, Stack, Typography } from '@mui/material';

// Styles
import { OrangeButton } from '../../style/colors';

// Logo
import logo from '../../Images/logo.png';

export default function Auth(): JSX.Element {
  // Context
  const { setDemo } = useAuth();

  // State
  const [quickLoad, setQuickLoad] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setQuickLoad(false), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Container sx={{ height: '100%', pb: '2rem' }}>
      <CssBaseline />
      <Stack sx={{ height: 'inherit', marginTop: '4vh' }} spacing={6} alignItems="center">
        {quickLoad ? (
          <CircularProgress
            sx={{ color: 'primary.main', width: '10rem!important', height: '10rem!important', marginTop: '20vh' }}
          />
        ) : (
          <>
            <img src={logo} alt="Logo" />
            <Paper
              elevation={4}
              sx={{
                height: {
                  sm: '32rem',
                  xs: '30rem',
                },
                width: {
                  sm: '35rem',
                  xs: '92vw',
                },
                paddingTop: 8,
              }}
            >
              <Stack direction="column" alignItems="center" spacing={9}>
                <Stack spacing={5}>
                  <Typography variant="h1" sx={{ textAlign: 'center' }}>
                    Welcome to CalendApp!
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ lineHeight: '1.5rem', color: 'hsl(0,0%,50%)', textAlign: 'center', width: { sm: '25rem' } }}
                  >
                    The easiest way for you to sign up is with Google. This will automatically connect your calendar so
                    you can start using CalendApp right away!
                  </Typography>
                </Stack>
                <Stack spacing={3}>
                  <Button
                    href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}
                    sx={{
                      ...OrangeButton,
                      border: 0,
                      borderRadius: 1,
                      height: '3.5rem',
                      padding: '0 30px',
                      fontSize: '1rem',
                    }}
                  >
                    <Box
                      component="img"
                      sx={{ height: '1.5rem', paddingRight: '15px' }}
                      alt="Google sign-in"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                    />
                    Continue with Google
                  </Button>
                  <Button
                    onClick={setDemo}
                    sx={{
                      ...OrangeButton,
                      border: 0,
                      borderRadius: 1,
                      height: '3.5rem',
                      padding: '0 30px',
                      fontSize: '1rem',
                    }}
                  >
                    Demo
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </>
        )}
      </Stack>
    </Container>
  );
}
