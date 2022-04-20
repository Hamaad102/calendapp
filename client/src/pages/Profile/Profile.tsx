import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Context
import { useProfile } from '../../context/useProfileContext';

// Component
import Overview from '../../components/Profile/Overview/Overview';

// MUI
import { CircularProgress, Container, CssBaseline, Stack } from '@mui/material';

export default function Profile(): JSX.Element {
  // Context
  const { load, error, validUser } = useProfile();

  // Validated user and retrieve their info
  const { url } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (url) validUser(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) navigate('/error');
  }, [navigate, error]);
  return (
    <Container sx={{ height: '100%', pb: '2rem' }}>
      <CssBaseline />
      <Stack sx={{ height: 'inherit', marginTop: '4vh' }} spacing={6} alignItems="center">
        {load ? (
          <CircularProgress
            sx={{ color: 'primary.main', width: '10rem!important', height: '10rem!important', marginTop: '20vh' }}
          />
        ) : (
          <Overview />
        )}
      </Stack>
    </Container>
  );
}
