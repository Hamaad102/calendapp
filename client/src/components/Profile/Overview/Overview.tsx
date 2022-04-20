import { useParams, useNavigate } from 'react-router-dom';

// Context
import { useProfile } from '../../../context/useProfileContext';

// MUI
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Box, Container, Divider, CssBaseline, Grid, Paper, Stack, Typography } from '@mui/material';

export default function Overview(): JSX.Element {
  // Context
  const { username, picture, events, setSelectedEventContext } = useProfile();

  const { url } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
      <Paper elevation={4} sx={{ pb: '10rem' }}>
        <Stack alignItems="center" spacing={4} marginTop={5} marginBottom={8}>
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
            <Typography variant="h1">{username}</Typography>
          </Stack>
          <Typography variant="h6" textAlign="center" sx={{ fontSize: { sm: '1.0938rem', xs: '0.9rem' } }}>
            Welcome to my scheduling page. Please
            <br />
            follow the instructions to add an event to my
            <br />
            calendar.
          </Typography>
        </Stack>
        <Container>
          <Grid container direction="row" alignItems="center">
            {events.map((event) => {
              const values = event.split('/');
              return (
                <Grid
                  key={values[3]}
                  item
                  sm={6}
                  xs={12}
                  paddingLeft={2}
                  paddingBottom={4}
                  sx={{ '&:hover': { cursor: 'pointer', background: 'hsl(0,0%,60%)' }, height: '8rem' }}
                  onClick={() => {
                    setSelectedEventContext(event);
                    navigate(`/${url}/${values[3]}`);
                  }}
                >
                  <Divider />
                  <Stack marginTop={3} direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        component="div"
                        sx={{
                          width: '2rem',
                          height: '2rem',
                          backgroundColor: values[1],
                          borderRadius: '100%',
                        }}
                      />
                      <Stack>
                        <Typography variant="h2">{values[0]} minute meeting</Typography>
                        <Typography>{values[2]}</Typography>
                      </Stack>
                    </Stack>
                    <ArrowRightIcon sx={{ fontSize: '2rem' }} />
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Paper>
    </>
  );
}
