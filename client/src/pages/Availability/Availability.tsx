// Components
import Navbar from '../../components/Navbar/Navbar';
import AvailComp from '../../components/Availability/Availability';

// MUI
import { Container, CssBaseline, Divider, Paper, Stack, Typography } from '@mui/material';

export default function Availability(): JSX.Element {
  return (
    <>
      <CssBaseline />
      <Stack sx={{ height: '100%' }} alignItems="center" spacing={{ sm: 24, xs: 16 }}>
        <Navbar />
        <Container sx={{ height: '100%', pb: '2rem' }}>
          <Paper
            elevation={4}
            sx={{
              paddingTop: 8,
              paddingBottom: { sm: 10, xs: 6 },
            }}
          >
            <Stack direction="row" justifyContent="space-around">
              <Typography sx={{ textAlign: 'center' }} variant="h1">
                Set your availability
              </Typography>
            </Stack>
            <Divider sx={{ marginTop: 7 }} />
            <AvailComp status={'update'} />
          </Paper>
        </Container>
      </Stack>
    </>
  );
}
