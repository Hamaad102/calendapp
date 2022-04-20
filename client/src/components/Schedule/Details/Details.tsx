// Context
import { useProfile } from '../../../context/useProfileContext';

// MUI
import { Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Details(): JSX.Element {
  // Context
  const { username, selectedEvent } = useProfile();

  return (
    <Stack
      direction="column"
      marginTop={{ md: 10, xs: 5 }}
      spacing={{ md: 3, xs: 2 }}
      alignItems={{ md: 'start', xs: 'center' }}
    >
      <Stack direction="column" spacing={1} alignItems={{ md: 'start', xs: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 300 }}>
          {username}
        </Typography>
        <Typography variant="h1">{selectedEvent[0]} minute meeting</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <AccessTimeIcon />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {selectedEvent[0]} min
        </Typography>
      </Stack>
    </Stack>
  );
}
