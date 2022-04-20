import moment from 'moment-timezone';
import { useState, useEffect } from 'react';

// Context
import { useAuth } from '../../../context/useAuthContext';

// API Calls
import { deleteMeeting } from '../../../interface/Schedule';

// MUI
import { Box, Button, Container, Stack, Typography } from '@mui/material';

// Style
import { OrangeButton } from '../../../style/colors';

export default function ScheduledEvent(): JSX.Element {
  const { loggedInUser, schedule, updateScheduleContext } = useAuth();

  // State
  const [view, setView] = useState<boolean>(true);
  const [pastEvents, setPastEvents] = useState<Array<Array<string>>>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Array<Array<string>>>([]);

  const ButtonSelected = {
    color: 'primary.main',
    borderBottom: '4px solid darkOrange',
    borderRadius: '0',
    fontWeight: 700,
    fontSize: '0.9rem',
    '&:hover': {
      background: 'none',
    },
  };

  const ButtonUnSelected = {
    color: 'secondary.main',
    borderBottom: '4px solid #ffffff',
    borderRadius: '0',
    fontWeight: 700,
    fontSize: '0.9rem',
    '&:hover': {
      background: 'none',
      borderBottom: '4px solid darkOrange',
      color: 'primary.main',
    },
  };

  const handleDelete = (deleteId: string) => {
    if (loggedInUser?.mongoid !== undefined)
      deleteMeeting(loggedInUser.mongoid, deleteId).then(() => {
        let scheduleCopy = [...schedule];
        let scheduleIndex: number;
        schedule.forEach((appointment, index) => {
          const splitAppoint = appointment.split('/');
          if (splitAppoint[10] === deleteId) scheduleIndex = index;
        });
        scheduleCopy = scheduleCopy.filter((appoint) => appoint !== schedule[scheduleIndex]);
        updateScheduleContext(scheduleCopy);
      });
  };

  const populateEvents = () => {
    const past: Array<Array<string>> = [];
    const upcoming: Array<Array<string>> = [];

    if (schedule.length) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      schedule.forEach((event) => {
        const readableEvent = event.split('/');
        if (moment(readableEvent[0]).isSameOrAfter(moment(currentDate))) upcoming.push(readableEvent);
        else past.push(readableEvent);
      });
    }

    setPastEvents(past);
    setUpcomingEvents(upcoming);
  };

  useEffect(() => {
    populateEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="column" sx={{ backgroundColor: 'ghostWhite', paddingTop: 7, pb: 7 }}>
      <Container sx={{ backgroundColor: 'white' }}>
        <Stack direction="column" spacing={5}>
          <Stack direction="row" spacing={4}>
            <Button
              disableRipple
              sx={view ? { ...ButtonSelected } : { ...ButtonUnSelected }}
              onClick={() => {
                if (!view) setView(true);
              }}
            >
              Upcoming
            </Button>
            <Button
              disableRipple
              sx={!view ? { ...ButtonSelected } : { ...ButtonUnSelected }}
              onClick={() => {
                if (view) setView(false);
              }}
            >
              Past
            </Button>
          </Stack>
          {view ? (
            !upcomingEvents.length ? (
              <Stack direction="row" sx={{ p: 3 }} justifyContent="center" alignItems="center">
                <Typography>No upcoming appointments</Typography>
              </Stack>
            ) : (
              upcomingEvents.map((event) => (
                <Stack direction="row" key={event[10]} sx={{ p: 3 }} justifyContent="space-between" alignItems="center">
                  <Stack spacing={2}>
                    <Typography>{moment(event[0]).format('dddd, D MMMM, YYYY')}</Typography>
                    <Stack direction={{ sm: 'row', xs: 'column' }} spacing={{ sm: 6, xs: 2 }}>
                      <Box
                        component="div"
                        sx={{ width: '1.5rem', height: '1.5rem', backgroundColor: event[2], borderRadius: '100%' }}
                      />
                      <Typography>{event[6]}</Typography>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ fontWeight: 700 }}>
                          {event[4]} - {event[3]}
                        </Typography>
                        <Typography>Event type {event[1]} Minute Meeting</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Button onClick={() => handleDelete(event[10])} sx={{ ...OrangeButton, height: '2rem' }}>
                    Delete
                  </Button>
                </Stack>
              ))
            )
          ) : !pastEvents.length ? (
            <Stack direction="row" sx={{ p: 3 }} justifyContent="center" alignItems="center">
              <Typography>No past appointments</Typography>
            </Stack>
          ) : (
            pastEvents.map((event) => (
              <Stack direction="row" key={event[10]} sx={{ p: 3 }} justifyContent="space-between" alignItems="center">
                <Stack spacing={2}>
                  <Typography>{moment(event[0]).format('dddd, D MMMM, YYYY')}</Typography>
                  <Stack direction={{ sm: 'row', xs: 'column' }} spacing={{ sm: 6, xs: 2 }}>
                    <Box
                      component="div"
                      sx={{ width: '1.5rem', height: '1.5rem', backgroundColor: event[2], borderRadius: '100%' }}
                    />
                    <Typography>{event[6]}</Typography>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {event[4]} - {event[3]}
                      </Typography>
                      <Typography>Event type {event[1]} Minute Meeting</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </Container>
    </Stack>
  );
}
