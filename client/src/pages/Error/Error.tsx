// MUI
import { Container, CssBaseline, Stack, Typography } from '@mui/material';

export default function Error(): JSX.Element {
  return (
    <Container sx={{ height: '100%', pb: '2rem' }}>
      <CssBaseline />
      <Stack sx={{ height: 'inherit', marginTop: '4vh' }} alignItems="center">
        <Typography>Something went wrong. Please try again.</Typography>
      </Stack>
    </Container>
  );
}
