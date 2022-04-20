import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Context
import { useProfile } from '../../context/useProfileContext';

// API Calls
import { bookMeeting, deleteMeeting } from '../../interface/Schedule';

// MUI
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
  Stack,
} from '@mui/material';

// Style
import { OrangeButton, ButtonStyle } from '../../style/colors';
import { ButtonSize } from '../../style/size';

export default function Book(): JSX.Element {
  // Context
  const { mongoid, username, timezone, userTimezone, selectedEvent, selectedDay, selectedTime, setUserActionsDefault } =
    useProfile();

  // State
  const [load, setLoad] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [display, setDisplay] = useState<boolean>(true);
  const [cancel, setCancel] = useState<boolean>(false);
  const [googleEventId, setGoogleEventId] = useState<string>('');

  const [validEmail, setValidEmail] = useState<boolean>(false);

  const { url, eventid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedTime) navigate(`/${url}/${eventid}`);
    else setLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedDay = moment(selectedDay).format('dddd, D MMMM, YYYY');
  const formattedSelectedDay = moment(selectedDay).format('YYYY-MM-DD');
  const endTime = moment(selectedTime, 'HH:mm a').add(15, 'minutes').format('HH:mm a');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scheduleEvent = (e: any) => {
    e.preventDefault();
    setValidEmail(false);
    let x = '';
    if (email) x = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? '' : 'Email is not valid.';
    if (x) setValidEmail(true);
    else {
      const startTimeGoogle = moment(selectedTime, 'HH:mm a').format('HH:mm');
      const endTimeGoogle = moment(endTime, 'HH:mm a').format('HH:mm');

      const ownerStartTime = moment
        .tz(`${formattedSelectedDay} ${startTimeGoogle}`, userTimezone)
        .tz(timezone)
        .format('HH:mm');

      const ownerEndTime = moment
        .tz(`${formattedSelectedDay} ${endTimeGoogle}`, userTimezone)
        .tz(timezone)
        .format('HH:mm');

      setLoad(true);
      bookMeeting(
        mongoid,
        formattedSelectedDay,
        selectedEvent,
        startTimeGoogle,
        endTimeGoogle,
        ownerStartTime,
        ownerEndTime,
        name,
        email,
        userTimezone,
      )
        .then((res) => {
          setGoogleEventId(res.data.googleEventId);
          setDisplay(false);
          setLoad(false);
        })
        .catch(() => navigate('/error'));
    }
  };

  const cancelEvent = () => {
    setLoad(true);
    deleteMeeting(mongoid, googleEventId)
      .then(() => {
        setCancel(true);
        setLoad(false);
      })
      .catch(() => navigate('/error'));
  };

  const rescheduleEvent = () => {
    setLoad(true);
    deleteMeeting(mongoid, googleEventId)
      .then(() => {
        setUserActionsDefault();
        navigate(`/${url}`);
      })
      .catch(() => navigate('/error'));
  };

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
          <Paper elevation={4} sx={{ pb: '6rem', height: { sm: '45rem' }, px: { sm: 10, xs: 2 } }}>
            {display ? (
              <Grid container spacing={2}>
                {/* Meeting Details */}
                <Grid item md={5} xs={12}>
                  <Stack
                    direction="column"
                    marginTop={{ sm: 5, xs: 2 }}
                    spacing={{ md: 2, xs: 3 }}
                    alignItems={{ md: 'start', sm: 'center' }}
                  >
                    <ArrowBackIosIcon
                      onClick={() => navigate(`/${url}/${eventid}`)}
                      sx={{
                        fontSize: '1.5rem',
                        border: '1px solid darkOrange',
                        background: 'snow',
                        borderRadius: '100%',
                        paddingLeft: '5px',
                        color: 'darkOrange',
                        '&:hover': {
                          color: 'snow',
                          background: 'darkOrange',
                          cursor: 'pointer',
                        },
                        display: { md: 'inline-block', xs: 'none' },
                      }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 300, display: { sm: 'block', xs: 'none' } }}>
                      {username}
                    </Typography>
                    <Typography variant="h1" sx={{ textAlign: 'center' }}>
                      {selectedEvent[0]} minute meeting
                    </Typography>
                    <Stack direction={{ md: 'column', sm: 'row', xs: 'column' }} spacing={{ sm: 2, xs: 3 }}>
                      <Stack direction="row" spacing={1} alignItems={{ md: 'start', sm: 'center', xs: 'start' }}>
                        <AccessTimeIcon />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {selectedEvent[0]} min
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems={{ md: 'start', xs: 'center' }}>
                        <CalendarTodayIcon />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {selectedTime} - {endTime}, {formattedDay}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems={{ md: 'start', xs: 'center' }}>
                      <PublicIcon />
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {userTimezone}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {/* User details */}
                <Grid item md={5} xs={12}>
                  <Stack direction="column" marginTop={5} spacing={4} alignItems={{ md: 'initial', xs: 'center' }}>
                    <Typography variant="h1">Enter Details</Typography>
                    <form onSubmit={scheduleEvent}>
                      <Stack spacing={{ md: 10, xs: 5 }}>
                        <Stack spacing={{ md: 4, xs: 2 }}>
                          <Stack spacing={{ md: 2, xs: 2 }}>
                            <Typography variant="h2">Name*</Typography>
                            <TextField
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              id="outlined-basic"
                              variant="outlined"
                            />
                          </Stack>
                          <Stack spacing={{ md: 2, xs: 2 }}>
                            <Typography variant="h2">Email*</Typography>
                            <TextField
                              value={email}
                              error={validEmail}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              id="outlined-basic"
                              variant="outlined"
                            />
                          </Stack>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems={{ md: 'start', xs: 'center' }}
                          justifyContent={{ md: 'start', xs: 'center' }}
                          spacing={{ md: 0, xs: 3 }}
                        >
                          <ArrowBackIosIcon
                            onClick={() => navigate(`/${url}/${eventid}`)}
                            sx={{
                              fontSize: '2.5rem',
                              border: '1px solid darkOrange',
                              background: 'darkOrange',
                              paddingLeft: '10px',
                              color: 'white',
                              '&:hover': {
                                color: 'snow',
                                background: 'darkOrange',
                                cursor: 'pointer',
                              },
                              borderRadius: '5px',
                              display: { md: 'none', xs: 'inline-block' },
                            }}
                          />
                          <Button
                            sx={{
                              ...ButtonSize,
                              ...ButtonStyle,
                              width: '12rem',
                            }}
                            type="submit"
                          >
                            Schedule Event
                          </Button>
                        </Stack>
                      </Stack>
                    </form>
                  </Stack>
                </Grid>
              </Grid>
            ) : !cancel ? (
              <Stack alignItems="center" marginTop={10} spacing={4}>
                <Typography variant="h1" sx={{ fontWeight: '500!important', lineHeight: 1.7 }}>
                  Hi, {name} <br />
                  {selectedEvent[0]} minute meeting with {username} at {selectedTime} ({userTimezone})<br /> on{' '}
                  {formattedDay} is scheduled.
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
                  onClick={() => {
                    setUserActionsDefault();
                    navigate(`/${url}`);
                  }}
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
