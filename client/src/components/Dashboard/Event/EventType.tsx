import { useState } from 'react';

// Context
import { useAuth } from '../../../context/useAuthContext';

// Component
import EventBox from './EventBox/EventBox';
import Details from './Details/Details';

// MUI
import { Box, Button, Container, Stack, Tooltip, Typography } from '@mui/material';

// Style
import { ButtonStyle } from '../../../style/colors';
import { ButtonSize } from '../../../style/size';

export default function EventType(): JSX.Element {
  // Context
  const { loggedInUser, picture, url, premium } = useAuth();

  // Modal State
  const [openModal, setModalOpen] = useState<boolean>(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const CalendLink = {
    fontWeight: 300,
    fontSize: '0.9rem',
    color: 'hsl(0,0%,60%)',
  };

  const PremiumButton = {
    border: '2px solid #bec2c9',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#bec2c9',
    padding: '0.4rem 1.2rem 0.4rem 1.2rem',
    '&:hover': {
      backgroundColor: 'ghostwhite',
    },
  };

  return (
    <Stack direction="column" sx={{ backgroundColor: 'ghostWhite', paddingTop: 7, pb: 7 }}>
      <Container>
        <Stack sx={{ marginBottom: 5 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              src={picture}
              alt="Avatar"
              sx={{
                width: '3rem',
                height: '3rem',
                borderRadius: '100%',
              }}
            />
            <Stack direction="column">
              <Typography variant="h2">{loggedInUser?.username}</Typography>
              <Typography sx={{ ...CalendLink }}>calendapp.com/{url}</Typography>
            </Stack>
          </Stack>
          {premium ? (
            <>
              <Button
                onClick={handleModalOpen}
                sx={{ ...ButtonSize, ...ButtonStyle, display: { sm: 'inline-flex', xs: 'none' } }}
              >
                + New event type
              </Button>
              <Button
                sx={{
                  ...ButtonSize,
                  ...ButtonStyle,
                  display: { sm: 'none' },
                }}
                onClick={handleModalOpen}
              >
                +
              </Button>
            </>
          ) : (
            <>
              <Tooltip title="Get Premium to create more events" placement="top-start">
                <Button
                  aria-label="Get Premium to create more events"
                  sx={{ ...PremiumButton, display: { sm: 'block', xs: 'none' } }}
                >
                  + New event type
                </Button>
              </Tooltip>
              <Tooltip title="Get Premium to create more events" placement="top-start">
                <Button
                  sx={{
                    ...PremiumButton,
                    display: { sm: 'none' },
                  }}
                >
                  +
                </Button>
              </Tooltip>
            </>
          )}
        </Stack>
        <EventBox />
        <Details
          openModal={openModal}
          description="One-on-one"
          duration="15"
          color="#7900ff"
          eventId=""
          handleModalClose={handleModalClose}
        />
      </Container>
    </Stack>
  );
}
