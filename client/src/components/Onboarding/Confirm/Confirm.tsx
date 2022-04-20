// Context
import { useAuth } from '../../../context/useAuthContext';

// MUI
import { Button, CssBaseline, Divider, Stack, Typography } from '@mui/material';

// Style
import { OnboardPosition } from '../../../style/size';
import { OrangeButton } from '../../../style/colors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Confirm({ updateState }: { updateState: any }): JSX.Element {
  const { loggedInUser, updateAvailability } = useAuth();

  const handleContinue = () => updateState(2, 'Set your availability', 75);

  const handleSkip = () => updateAvailability(['08:00', '17:00'], ['Saturday', 'Sunday']);

  return (
    <>
      <CssBaseline />
      <Stack direction="column" sx={{ ...OnboardPosition, marginTop: 6 }}>
        <Typography
          variant="h1"
          sx={{
            marginBottom: 4,
            fontSize: { sm: '1.8rem!important', xs: '1rem!important' },
            textAlign: { sm: 'left!important', xs: 'center!important' },
          }}
        >
          Here is how CalendApp will work with {loggedInUser?.email}:
        </Typography>
        <Divider />
        <Typography sx={{ px: 4, py: 4 }} variant="h4">
          1. We will check <span style={{ fontWeight: 700 }}>{loggedInUser?.email}</span> for conflicts
        </Typography>
        <Divider />
        <Typography sx={{ px: 4, py: 4 }} variant="h4">
          2. We will add event to <span style={{ fontWeight: 700 }}>{loggedInUser?.email}</span>
        </Typography>
        <Divider />
        <Stack sx={{ marginTop: 7 }} direction="column" alignItems="center">
          <Button
            sx={{ ...OrangeButton, border: 0, borderRadius: 1, height: '3.5rem', padding: '0 30px', fontSize: '1rem' }}
            onClick={handleContinue}
          >
            Continue
          </Button>
          <Button
            sx={{
              background: 'none',
              border: 0,
              color: 'grey!important',
              height: '3.5rem',
              width: '10rem',
              marginTop: 1,
              fontSize: '1rem',
              fontWeight: 300,
              '&:hover': {
                background: 'none',
                color: 'black',
              },
            }}
            onClick={handleSkip}
            disableRipple={true}
          >
            Set up Later
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
