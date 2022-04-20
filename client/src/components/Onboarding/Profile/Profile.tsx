import { useState } from 'react';
import moment from 'moment-timezone';

// Context
import { useAuth } from '../../../context/useAuthContext';

// API Calls
import { existing_url_check } from '../../../interface/Settings';

// MUI
import { Autocomplete, Button, CssBaseline, InputAdornment, Stack, TextField, Typography } from '@mui/material';

// Styles
import { OrangeButton } from '../../../style/colors';
import { OnboardPosition, OnboardInputSize } from '../../../style/size';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Profile({ updateState }: { updateState: any }): JSX.Element {
  const { updateProfile } = useAuth();
  // Error Handler
  const [inuse, setInUse] = useState<boolean>(false);
  // User settings
  const [url, setUrl] = useState<string>('');
  const [timezone, setTimezone] = useState(moment.tz.guess());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setInUse(false);
    const localUrl: string | undefined = url?.replace(/\s/g, '-').toLowerCase();
    existing_url_check(url).then((res) => {
      if (res.data.length === 0) {
        updateProfile(localUrl, timezone);
        updateState(0, `Your Google Calendar is connected!`, 50);
      } else setInUse(true);
    });
  };

  return (
    <>
      <CssBaseline />
      <form onSubmit={handleSubmit}>
        <Stack
          sx={{
            ...OnboardPosition,
            flexDirection: { sm: 'row', xs: 'column' },
            marginLeft: { sm: '0!important', xs: '1rem!important' },
          }}
        >
          <Typography sx={{ marginTop: 2 }} variant="h2">
            Create your CalendApp URL:
          </Typography>
          <TextField
            id="url-field"
            name="url"
            value={url}
            required
            helperText={inuse ? 'URL is already in use' : ''}
            error={inuse}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ ...OnboardInputSize }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" component="span" style={{ fontWeight: 700 }}>
                  CalendApp.com |
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack
          sx={{
            ...OnboardPosition,
            marginTop: { sm: 7, xs: 3 },
            flexDirection: { sm: 'row', xs: 'column' },
            marginLeft: { sm: '0!important', xs: '1rem!important' },
          }}
        >
          <Typography sx={{ marginTop: 2 }} variant="h2">
            Choose your timezone:
          </Typography>
          <Autocomplete
            id="timezone-field"
            value={timezone}
            sx={{ ...OnboardInputSize }}
            options={moment.tz.names()}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
            onChange={(e, value) => {
              if (typeof value === 'string') setTimezone(value);
            }}
          />
        </Stack>
        <Stack sx={{ marginTop: 10 }} direction="column" alignItems="center">
          <Button
            sx={{
              ...OrangeButton,
              border: 0,
              borderRadius: 1,
              height: '3.5rem',
              padding: '0 30px',
              fontSize: '1rem',
            }}
            type="submit"
          >
            Continue
          </Button>
        </Stack>
      </form>
    </>
  );
}
