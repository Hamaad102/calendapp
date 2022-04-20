import moment from 'moment-timezone';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';

// API Calls
import { retrieveScheduledEvents } from '../../../interface/Schedule';

// Context
import { useProfile } from '../../../context/useProfileContext';

// MUI
import { Autocomplete, Button, CssBaseline, Stack, TextField, Typography } from '@mui/material';

// Style
import { OrangeButton } from '../../../style/colors';

export default function Calend(): JSX.Element {
  // Context
  const {
    mongoid,
    days,
    updateSelectedDayContext,
    timezone,
    setUserTimezoneContext,
    setOwnersScheduledEventsContext,
    mobileContinue,
    setMobileContinueContext,
    eventsRetrieved,
    setEventsRetrievedContext,
  } = useProfile();

  // State
  const [componentTimezone, setComponentTimezone] = useState<string>(timezone);

  const checkAvailability = (date: Date) => {
    let buttonAvailable = false;
    days.forEach((day) => {
      if (moment(date).format('dddd') === day) buttonAvailable = true;
    });
    return buttonAvailable;
  };

  useEffect(() => {
    setUserTimezoneContext(componentTimezone);
  }, [componentTimezone, setUserTimezoneContext]);

  return (
    <>
      <CssBaseline />
      <Stack
        direction="column"
        paddingLeft={{ md: 6 }}
        marginTop={{ md: 10, xs: 5 }}
        spacing={2}
        alignItems={{ md: 'start', xs: 'center' }}
        sx={{
          display: { sm: 'flex', xs: mobileContinue ? 'none' : 'flex' },
          '.react-calendar': {
            width: { sm: '350px' },
            maxWidth: '95%',
            fontFamily: 'Open Sans, sans-serif, Roboto',
            lineHeight: '1.125em',
            marginTop: '1rem',
          },
          '.react-calendar--doubleView': {
            width: '700px',
          },
          '.react-calendar--doubleView .react-calendar__viewContainer': {
            display: 'flex',
            margin: '-0.5em',
          },
          '.react-calendar--doubleView .react-calendar__viewContainer > *': {
            width: '50%',
            margin: '0.5em',
          },
          '.react-calendar, .react-calendar *, .react-calendar *:before, .react-calendar *:after': {
            boxSizing: 'border-box',
          },
          '.react-calendar button': {
            margin: 0,
            border: 0,
            outline: 'none',
          },
          '.react-calendar button:enabled:hover': {
            cursor: 'pointer',
          },
          '.react-calendar__navigation': {
            display: 'flex',
            height: '44px',
            marginBottom: '1em',
          },
          '.react-calendar__navigation button': {
            minWidth: '44px',
            background: 'none',
            fontSize: '1rem',
            fontWeight: '300',
            color: 'gray',
            transition: '0.5s color',
          },
          '.react-calendar__navigation button:disabled': {
            backgroundColor: 'white',
          },
          '.react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus': {
            color: 'darkOrange',
            backgroundColor: 'snow',
          },
          '.react-calendar__month-view__weekdays': {
            textAlign: 'center',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '0.75rem',
          },
          '.react-calendar__month-view__weekdays__weekday': {
            padding: '0.5em',
          },
          '.react-calendar__month-view__weekNumbers .react-calendar__tile': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75em',
            fontWeight: 'bold',
            padding: 'calc(0.75em / 0.75) calc(0.5em / 0.75)',
          },
          '.react-calendar__year-view .react-calendar__tile, .react-calendar__decade-view .react-calendar__tile, .react-calendar__century-view .react-calendar__tile':
            {
              padding: '2em 0.5em',
            },
          '.react-calendar__tile': {
            maxWidth: '100%',
            textAlign: 'center',
            padding: '0.75em 0.5em',
            background: 'hsl(223,73%,97%)',
            borderRadius: '30%',
          },
          '.react-calendar__tile:disabled': {
            backgroundColor: 'white',
          },
          '.react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus': {
            backgroundColor: 'darkOrange',
            color: 'snow',
          },
          '.react-calendar__tile--now': {
            background: 'hsl(223,73%,97%)',
          },
          '.react-calendar__tile--now:enabled:hover, .react-calendar__tile--now:enabled:focus': {
            background: 'darkOrange',
          },
          '.react-calendar__tile--hasActive': {
            background: 'darkOrange',
            color: 'snow',
          },
          '.react-calendar__tile--active': {
            background: 'darkOrange',
            color: 'snow',
          },
          '.react-calendar__month-view__days': {
            height: '16rem',
          },
          '.react-calendar > div.react-calendar__viewContainer > div > div > div > div.react-calendar__month-view__days > button':
            {
              border: '4px solid white',
            },
          'abbr[title]': {
            textDecoration: 'none',
          },
        }}
      >
        <Typography variant="h1">Select a Date & Time</Typography>
        <Calendar
          minDetail="month"
          nextLabel={null}
          next2Label={null}
          prevLabel={null}
          prev2Label={null}
          showNeighboringMonth={false}
          minDate={new Date()}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onClickDay={(value, event) => {
            setEventsRetrievedContext(false);
            updateSelectedDayContext(value);
            const formattedSelectedDay = moment(value).format('YYYY-MM-DD');
            retrieveScheduledEvents(mongoid, formattedSelectedDay).then((res) => {
              setOwnersScheduledEventsContext(res.data);
            });
          }}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          tileDisabled={({ date, view }) => checkAvailability(date)}
        />
        <Autocomplete
          sx={{ width: { sm: '20rem', xs: '80vw' }, paddingTop: 5 }}
          id="timezone-field"
          value={componentTimezone}
          options={moment.tz.names()}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
          onChange={(e, value) => {
            if (typeof value === 'string') setComponentTimezone(value);
          }}
        />
        <Button
          onClick={() => {
            if (eventsRetrieved) setMobileContinueContext(true);
          }}
          sx={{
            display: { sm: 'none', xs: 'inline-flex', marginTop: '3rem!important' },
            ...OrangeButton,
            px: 4,
            py: 1,
          }}
        >
          Next
        </Button>
      </Stack>
    </>
  );
}
