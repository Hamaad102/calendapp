import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// API Calls
import { getMeetingInfo, deleteMeeting } from '../../interface/Schedule';

// MUI
import { Button, CircularProgress, Container, CssBaseline, Paper, Typography, Stack } from '@mui/material';

// Style
import { OrangeButton } from '../../style/colors';

export default function Change(): JSX.Element {
  // Local State
  const [load, setLoad] = useState<boolean>(true);
  const [cancel, setCancel] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [guest, setGuest] = useState<string>('');
  const [formattedDay, setFormattedDay] = useState<string>('');

  const navigate = useNavigate();
  const { mongoid, googleEventId } = useParams();

  const cancelEvent = () => {
    setLoad(true);
    if (mongoid !== undefined && googleEventId !== undefined) {
      deleteMeeting(mongoid, googleEventId)
        .then(() => {
          setCancel(true);
          setLoad(false);
        })
        .catch(() => navigate('/error'));
    }
  };

  const rescheduleEvent = () => {
    setLoad(true);
    if (mongoid !== undefined && googleEventId !== undefined) {
      deleteMeeting(mongoid, googleEventId)
        .then(() => navigate(`/${url}`))
        .catch(() => navigate('/error'));
    }
  };

  useEffect(() => {
    if (mongoid !== undefined && googleEventId !== undefined) {
      getMeetingInfo(mongoid, googleEventId)
        .then((res) => {
          const { username, url } = res.data;
          const information = res.data.meetingInfo.split('/');

          const formatDay = moment(information[0]).format('dddd, D MMMM, YYYY');

          setUrl(url);
          setName(username);
          setFormattedDay(formatDay);
          setDuration(information[1]);
          setGuest(information[4]);
          setLoad(false);
        })
        .catch(() => navigate('/error'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ height: '100%', pb: '2rem' }}>
      <CssBaseline />
      <Stack
        sx={{ height: 'inherit', marginTop: { md: '10vh', xs: '5vh' } }}
        spacing={load ? 6 : 0}
        alignItems={load ? 'center' : ''}
      >
        {load ? (
          <CircularProgress
            sx={{ color: 'primary.main', width: '10rem!important', height: '10rem!important', marginTop: '20vh' }}
          />
        ) : (
          <Paper elevation={4} sx={{ pb: '6rem', height: { sm: '40rem' }, px: { sm: 10, xs: 2 } }}>
            {!cancel ? (
              <Stack alignItems="center" marginTop={10} spacing={4}>
                <Typography
                  variant="h1"
                  sx={{ fontWeight: '500!important', lineHeight: 1.7, textAlign: 'center', width: { md: '50rem' } }}
                >
                  {duration} minute meeting with {guest} and {name} on {formattedDay} is scheduled.
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  Make Changes to this event:
                </Typography>
                <Stack direction="column" spacing={2}>
                  <Button
                    onClick={rescheduleEvent}
                    sx={{ ...OrangeButton, fontSize: '1rem', fontWeight: 700, padding: '0.8rem 1.4rem 0.8rem 1.4rem' }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    onClick={cancelEvent}
                    sx={{ ...OrangeButton, fontSize: '1rem', fontWeight: 700, padding: '0.8rem 1.4rem 0.8rem 1.4rem' }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Stack alignItems="center" spacing={4} marginTop={15}>
                <Typography variant="h1" textAlign="center" lineHeight={1.7}>
                  Success! You have cancelled your appointment.
                  <br /> Would you like to book another?
                </Typography>
                <Button
                  onClick={() => navigate(`/${url}`)}
                  sx={{ ...OrangeButton, fontSize: '1rem', fontWeight: 700, padding: '0.8rem 1.4rem 0.8rem 1.4rem' }}
                >
                  Reschedule
                </Button>
              </Stack>
            )}
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
