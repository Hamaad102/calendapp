import { useState } from 'react';

// MUI
import { CssBaseline, Divider, LinearProgress, Paper, Stack, Typography } from '@mui/material';

// Components
import Profile from './Profile/Profile';
import Confirm from './Confirm/Confirm';
import Availability from '../Availability/Availability';

export default function Onboarding(): JSX.Element {
  // State
  const [page, setPage] = useState<number>(0);
  const [headText, setHeadText] = useState<string>('Welcome to CalendApp!');
  const [progress, setProgress] = useState<number>(25);

  const updateState = (page: number, head: string, progress: number) => {
    setHeadText(head);
    setProgress(progress);
    if (page === 0) {
      setPage(1);
    } else {
      setPage(2);
    }
  };

  return (
    <>
      <CssBaseline />
      <Paper
        elevation={4}
        sx={{
          paddingTop: 8,
          paddingBottom: { sm: 22, xs: 8 },
        }}
      >
        <Stack direction="row" justifyContent="space-around">
          <Typography sx={{ textAlign: 'center' }} variant="h1">
            {headText}
          </Typography>
          <LinearProgress
            sx={{
              width: { md: '20rem', sm: '15rem' },
              height: '0.8rem',
              marginTop: '0.7rem',
              borderRadius: 42,
              display: { sm: 'block', xs: 'none' },
            }}
            variant="determinate"
            value={progress}
          />
        </Stack>
        <Divider sx={{ marginTop: 7 }} />
        <Stack direction="column">
          {page === 0 ? (
            <Profile updateState={updateState} />
          ) : page === 1 ? (
            <Confirm updateState={updateState} />
          ) : (
            <Availability status="initial" />
          )}
        </Stack>
      </Paper>
    </>
  );
}
