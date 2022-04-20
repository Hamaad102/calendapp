import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Context
import { useAuth } from '../../../context/useAuthContext';

// API Calls
import { checkout_success } from '../../../interface/Upgrade';

// MUI
import { Container, CircularProgress, CssBaseline, Stack } from '@mui/material';

export default function Success(): JSX.Element {
  // Context
  const { loggedInUser, premium, updatePremium } = useAuth();
  // Stripe Payment ID
  const { session } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (premium) navigate('/');
    else {
      checkout_success(loggedInUser?.mongoid, session)
        .then(() => {
          if (session) updatePremium(session);
          navigate('/');
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.data.message === 'User has already paid') navigate('/');
            else navigate('/error');
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ height: '100%', pb: '2rem' }}>
      <CssBaseline />
      <Stack sx={{ height: 'inherit', marginTop: '4vh' }} alignItems="center">
        <CircularProgress
          sx={{ color: 'primary.main', width: '10rem!important', height: '10rem!important', marginTop: '20vh' }}
        />
      </Stack>
    </Container>
  );
}
