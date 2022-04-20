import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Context
import { useProfile } from '../../../context/useProfileContext';

// MUI
import { Button, CssBaseline, Stack, Typography } from '@mui/material';

// Style
import { ButtonSize } from '../../../style/size';
import { OrangeButton } from '../../../style/colors';

export default function Time(): JSX.Element {
  // Context
  const {
    selectedEvent,
    selectedDay,
    ownersScheduledEvents,
    timezone,
    userTimezone,
    hours,
    eventsRetrieved,
    mobileContinue,
    setMobileContinueContext,
    setSelectedTimeContext,
  } = useProfile();

  // State
  const [increments, setIncrements] = useState<Array<string>>([]);

  const { url, eventid } = useParams();
  const navigate = useNavigate();

  // This function does the complicated job of taking the hours the owner is available as well as
  // Taking the time slots that are already booked on the owners calendar and returning time slots that are unoccupied
  const timeButtons = () => {
    const timeIncrements: Array<string> = [];
    const duration = Number(selectedEvent[0]);

    const formattedSelectedDay = moment(selectedDay).format('MM/DD/YYYY');

    const ownerStartTime: moment.Moment = moment(new Date(`${formattedSelectedDay} ${hours[0]}`), timezone);
    const ownerEndTime: moment.Moment = moment(new Date(`${formattedSelectedDay} ${hours[1]}`), timezone);

    const userStartTime = ownerStartTime.tz(userTimezone).format('HH:mm');
    const userEndTime = ownerEndTime.tz(userTimezone).format('HH:mm');

    const endDateUserTimezone: string = ownerEndTime.tz(userTimezone).format('MM/DD/YYYY');

    // The conversion is stored as a string therefore we need to convert into a moment object again to use the isBefore function provided by moment
    let startTime: moment.Moment = moment(new Date(`${formattedSelectedDay} ${userStartTime}`), userTimezone);
    const endTime: moment.Moment = moment(new Date(`${endDateUserTimezone} ${userEndTime}`), userTimezone);

    if (endDateUserTimezone !== formattedSelectedDay) {
      const morningAlt: moment.Moment = moment(new Date(`${endDateUserTimezone} 0:00`), userTimezone);
      let morning: moment.Moment = moment(new Date(`${endDateUserTimezone} 0:00`), userTimezone);
      const currentDay: string = moment(new Date(), userTimezone).format('MM/DD/YYYY');
      const currentTime = moment(new Date()).tz(userTimezone).format('HH:mm');

      while (morning.isBefore(endTime)) {
        const time = morning.format('HH:mm a');
        const timeMoment = moment(time, 'HH:mm');
        let unavailable = false;

        if (currentDay === formattedSelectedDay) {
          if (ownersScheduledEvents.length) {
            ownersScheduledEvents.forEach((appointment) => {
              const beforeTime = moment(moment(appointment.start).format());
              const afterTime = moment(moment(appointment.end).format());
              const beforeTimeUser = beforeTime.tz(userTimezone).format('HH:mm');
              const afterTimeUser = afterTime.tz(userTimezone).format('HH:mm');
              if (timeMoment.isAfter(moment(currentTime, 'HH:mm'))) {
                if (
                  timeMoment.isBetween(moment(beforeTimeUser, 'HH:mm'), moment(afterTimeUser, 'HH:mm')) ||
                  timeMoment.isSame(moment(beforeTimeUser, 'HH:mm'))
                ) {
                  unavailable = true;
                } else unavailable = true;
              }
            });
          } else {
            if (timeMoment.isAfter(moment(currentTime, 'HH:mm'))) {
              timeIncrements.push(time);
            }
          }
        } else {
          if (ownersScheduledEvents.length) {
            ownersScheduledEvents.forEach((appointment) => {
              const beforeTime = moment(moment(appointment.start).format());
              const afterTime = moment(moment(appointment.end).format());
              const beforeTimeUser = beforeTime.tz(userTimezone).format('HH:mm');
              const afterTimeUser = afterTime.tz(userTimezone).format('HH:mm');
              if (
                timeMoment.isBetween(moment(beforeTimeUser, 'HH:mm'), moment(afterTimeUser, 'HH:mm')) ||
                timeMoment.isSame(moment(beforeTimeUser, 'HH:mm'))
              ) {
                unavailable = true;
              }
            });
          } else {
            timeIncrements.push(time);
          }
        }
        if (!unavailable && ownersScheduledEvents.length) timeIncrements.push(time);
        morning = morning.add(duration, 'm');
      }

      while (startTime.isBefore(morningAlt)) {
        const time = startTime.format('HH:mm a');
        const timeMoment = moment(time, 'HH:mm');
        let unavailable = false;

        if (currentDay === formattedSelectedDay) {
          if (ownersScheduledEvents.length) {
            ownersScheduledEvents.forEach((appointment) => {
              const beforeTime = moment(moment(appointment.start).format());
              const afterTime = moment(moment(appointment.end).format());
              const beforeTimeUser = beforeTime.tz(userTimezone).format('HH:mm');
              const afterTimeUser = afterTime.tz(userTimezone).format('HH:mm');
              if (timeMoment.isAfter(moment(currentTime, 'HH:mm'))) {
                if (
                  timeMoment.isBetween(moment(beforeTimeUser, 'HH:mm'), moment(afterTimeUser, 'HH:mm')) ||
                  timeMoment.isSame(moment(beforeTimeUser, 'HH:mm'))
                ) {
                  unavailable = true;
                }
              } else unavailable = true;
            });
          } else {
            timeIncrements.push(time);
          }
        } else {
          if (ownersScheduledEvents.length) {
            ownersScheduledEvents.forEach((appointment) => {
              const beforeTime = moment(moment(appointment.start).format());
              const afterTime = moment(moment(appointment.end).format());
              const beforeTimeUser = beforeTime.tz(userTimezone).format('HH:mm');
              const afterTimeUser = afterTime.tz(userTimezone).format('HH:mm');
              if (
                timeMoment.isBetween(moment(beforeTimeUser, 'HH:mm'), moment(afterTimeUser, 'HH:mm')) ||
                timeMoment.isSame(moment(beforeTimeUser, 'HH:mm'))
              ) {
                unavailable = true;
              }
            });
          } else {
            timeIncrements.push(time);
          }
        }
        if (!unavailable && ownersScheduledEvents.length) timeIncrements.push(time);
        startTime = startTime.add(duration, 'm');
      }
    } else {
      while (startTime.isBefore(endTime)) {
        const time = startTime.format('HH:mm a');
        const timeMoment = moment(time, 'HH:mm');
        const currentDay: string = moment(new Date(), timezone).format('MM/DD/YYYY');
        const currentTime: string = moment(new Date(), timezone).format('HH:mm');

        let unavailable = false;

        if (currentDay === formattedSelectedDay) {
          if (ownersScheduledEvents.length) {
            ownersScheduledEvents.forEach((appointment) => {
              const beforeTime = moment(appointment.start).format('HH:mm');
              const afterTime = moment(appointment.end).format('HH:mm');
              if (timeMoment.isAfter(moment(currentTime, 'HH:mm'))) {
                if (
                  timeMoment.isBetween(moment(beforeTime, 'HH:mm'), moment(afterTime, 'HH:mm')) ||
                  timeMoment.isSame(moment(beforeTime, 'HH:mm'))
                ) {
                  unavailable = true;
                }
              } else unavailable = true;
            });
          } else {
            if (timeMoment.isAfter(moment(currentTime, 'HH:mm'))) {
              timeIncrements.push(time);
            }
          }
        } else {
          if (ownersScheduledEvents.length) {
            ownersScheduledEvents.forEach((appointment) => {
              const beforeTime = moment(appointment.start).format('HH:mm');
              const afterTime = moment(appointment.end).format('HH:mm');
              if (
                timeMoment.isBetween(moment(beforeTime, 'HH:mm'), moment(afterTime, 'HH:mm')) ||
                timeMoment.isSame(moment(beforeTime, 'HH:mm'))
              ) {
                unavailable = true;
              }
            });
          } else {
            timeIncrements.push(time);
          }
        }
        if (!unavailable && ownersScheduledEvents.length) timeIncrements.push(time);
        startTime = startTime.add(duration, 'm');
      }
    }

    setIncrements(timeIncrements);
  };

  useEffect(() => {
    if (eventsRetrieved) timeButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTimezone, eventsRetrieved]);

  return (
    <>
      <CssBaseline />
      <Stack
        direction="column"
        sx={{
          visibility: eventsRetrieved ? 'visible' : 'hidden',
          display: { sm: 'flex', xs: mobileContinue ? 'flex' : 'none' },
          width: '18rem',
          height: { md: 'calc(45rem - 13rem)', sm: '25rem' },
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            width: '0.4em',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
          },
        }}
        paddingLeft={{ sm: 6 }}
        paddingRight={{ sm: 2 }}
        marginTop={{ sm: '10rem' }}
        spacing={2}
        alignItems={{ sm: 'start', xs: 'center' }}
      >
        <Button
          onClick={() => setMobileContinueContext(false)}
          sx={{
            display: { sm: 'none', xs: 'inline-flex', marginTop: '3rem!important' },
            ...OrangeButton,
            width: '12rem',
            px: 4,
            py: 1,
            marginBottom: '1rem!important',
          }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 300, marginBottom: 2 }}>
          {moment(selectedDay).format('dddd, MMMM DD')}
        </Typography>
        {increments.length ? (
          increments.map((time) => (
            <Button
              key={time}
              sx={{
                ...ButtonSize,
                width: '12rem',
                color: '#acb6cb!important',
                border: '1px solid #acb6cb!important',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'ghostwhite!important',
                },
              }}
              onClick={() => {
                setSelectedTimeContext(time);
                navigate(`/${url}/${eventid}/book`);
              }}
            >
              {time}
            </Button>
          ))
        ) : (
          <Typography>No Available Appointments</Typography>
        )}
      </Stack>
    </>
  );
}
