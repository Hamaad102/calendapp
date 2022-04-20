import { useState } from 'react';

// Context
import { useAuth } from '../../context/useAuthContext';

// Components
import Navbar from '../../components/Navbar/Navbar';
import Onboarding from '../../components/Onboarding/Onboarding';
import EventTypes from '../../components/Dashboard/Event/EventType';
import ScheduledEvent from '../../components/Dashboard/Scheduled/ScheduledEvent';

// MUI
import { Button, Container, CssBaseline, Stack, Typography } from '@mui/material';

export default function Dashboard(): JSX.Element {
  // Context
  const { days } = useAuth();

  // State
  const [view, setView] = useState<boolean>(true);

  const ButtonSelected = {
    color: 'primary.main',
    borderBottom: '4px solid darkOrange',
    borderRadius: '0',
    fontWeight: 700,
    fontSize: '0.9rem',
    '&:hover': {
      background: 'none',
    },
  };

  const ButtonUnSelected = {
    color: 'secondary.main',
    borderBottom: '4px solid #ffffff',
    borderRadius: '0',
    fontWeight: 700,
    fontSize: '0.9rem',
    '&:hover': {
      background: 'none',
      borderBottom: '4px solid darkOrange',
      color: 'primary.main',
    },
  };

  return (
    <>
      <CssBaseline />
      <Stack sx={{ height: '100%' }} spacing={{ sm: 12, xs: 11 }} alignItems={days.length === 0 ? 'center' : ''}>
        <Navbar />
        {days.length === 0 ? (
          <Container sx={{ height: '100%', pb: '2rem' }}>
            <Onboarding />
          </Container>
        ) : (
          <Stack sx={{ height: 'inherit', marginTop: '8rem!important' }}>
            <Container sx={{ height: '100%' }}>
              <Stack spacing={2}>
                <Typography variant="h1">My CalendApp</Typography>
                <Stack direction="row" spacing={4}>
                  <Button
                    disableRipple
                    sx={view ? { ...ButtonSelected } : { ...ButtonUnSelected }}
                    onClick={() => {
                      if (!view) setView(true);
                    }}
                  >
                    Event Types
                  </Button>
                  <Button
                    disableRipple
                    sx={!view ? { ...ButtonSelected } : { ...ButtonUnSelected }}
                    onClick={() => {
                      if (view) setView(false);
                    }}
                  >
                    Scheduled Events
                  </Button>
                </Stack>
              </Stack>
            </Container>
            {view ? <EventTypes /> : <ScheduledEvent />}
          </Stack>
        )}
      </Stack>
    </>
  );
}
