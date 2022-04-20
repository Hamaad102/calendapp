import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Context
import { useProfile } from '../../context/useProfileContext';

// Component
import Details from '../../components/Schedule/Details/Details';
import Calend from '../../components/Schedule/Calendar/Calend';
import Time from '../../components/Schedule/Time/Time';

// MUI
import { CircularProgress, Container, CssBaseline, Paper, Stack } from '@mui/material';

export default function Schedule(): JSX.Element {
  // Context
  const { username, events, load, error, validUser, setSelectedEventContext } = useProfile();

  // Validated user and retrieve their info
  const { url, eventid } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!username && url && eventid) {
      validUser(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!error && !load) {
      events.forEach((event) => {
        const values = event.split('/');
        if (values[3] === eventid) {
          setSelectedEventContext(event);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  useEffect(() => {
    if (error) navigate('/error');
  }, [navigate, error]);

  return (
    <Container sx={{ height: '100%', pb: '2rem' }}>
      <CssBaseline />
      <Stack
        sx={{ height: 'inherit', marginTop: { md: '10vh', xs: '5vh' } }}
        spacing={load ? 6 : 0}
        alignItems={load ? 'center' : ''}
      >
        {load ? (
          <CircularProgress
            sx={{ color: 'primary.main', width: '10rem!important', height: '10rem!important', marginTop: '20vh' }}
          />
        ) : (
          <Paper elevation={4} sx={{ pb: '6rem', height: { sm: '45rem' } }}>
            <Stack
              direction={{ md: 'row', xs: 'column' }}
              justifyContent="center"
              alignItems={{ md: 'start', sm: 'center' }}
            >
              <Details />
              <Stack direction="row" justifyContent={{ sm: 'start', xs: 'center' }}>
                <Calend />
                <Time />
              </Stack>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
