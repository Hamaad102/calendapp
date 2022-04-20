import { useState } from 'react';

// Components
import Navbar from '../../components/Navbar/Navbar';

// API Calls
import { checkout_session } from '../../interface/Upgrade';

// MUI
import { CssBaseline, Divider, Paper, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

// Style
import { ButtonStyle } from '../../style/colors';
import { ButtonSize } from '../../style/size';

export default function Upgrade(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    setLoading(true);
    checkout_session(800, 'CalendApp Premium').then((res) => {
      window.location = res.data;
    });
  };

  return (
    <>
      <CssBaseline />
      <Stack sx={{ height: '100%', backgroundColor: 'ghostwhite' }} spacing={{ sm: 24, xs: 16 }}>
        <Navbar />
        <Stack direction="column" alignItems="center" spacing={6} sx={{ pb: 8 }}>
          <Stack direction="column" alignItems="center" spacing={2}>
            <Typography variant="h1" sx={{ fontSize: { sm: '2.4rem!important', xs: '2rem!important' } }}>
              Upgrade your account
            </Typography>
            <Typography variant="h4" sx={{ fontSize: '1rem!important', color: 'hsl(0,0%,60%)' }}>
              You are on the free basic plan
            </Typography>
          </Stack>

          <Paper
            elevation={4}
            sx={{
              paddingTop: 6,
              paddingBottom: { sm: 14, xs: 10 },
              width: { sm: '25rem', xs: '80vw' },
            }}
          >
            <Stack alignItems="center" spacing={6} marginBottom={5}>
              <Stack spacing={2}>
                <Typography variant="h1" sx={{ color: '#7900ff', fontSize: '2rem!important' }}>
                  Premium
                </Typography>
                <Typography sx={{ textAlign: 'center' }} variant="h2">
                  Only $8
                </Typography>
              </Stack>
              <LoadingButton
                onClick={handleSubmit}
                sx={{
                  ...ButtonSize,
                  ...ButtonStyle,
                  color: 'white!important',
                  padding: '0.8rem 2.4rem 0.8rem 2.4rem',
                }}
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
              >
                Upgrade
              </LoadingButton>
            </Stack>

            <Divider sx={{ width: '100%' }} />

            <Stack spacing={2} marginTop={6} marginLeft={6} marginRight={6}>
              <Stack direction="row" spacing={2}>
                <CheckIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h4" sx={{ fontSize: '1rem' }}>
                  Unlimited event types
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <CheckIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h4" sx={{ fontSize: '1rem' }}>
                  Group Meetings
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </>
  );
}
