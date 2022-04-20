import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Context
import { useAuth } from '../../context/useAuthContext';

// MUI
import { Button, Checkbox, CssBaseline, Stack, TextField, Typography } from '@mui/material';

// Style
import { OnboardPosition } from '../../style/size';
import { OrangeButton } from '../../style/colors';

export default function Availability({ status }: { status: string }): JSX.Element {
  const navigate = useNavigate();
  const daysContext = useAuth().days;
  const { updateAvailability } = useAuth();
  // Time state
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [timeError, setTimeError] = useState<boolean>(false);

  // Available days state
  const [days, setDays] = useState<Record<string, boolean>>({
    Sunday: false,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setTimeError(false);
    const start = Date.parse(`01/01/2011 ${startTime}`);
    const end = Date.parse(`01/01/2011 ${endTime}`);
    if (end > start) {
      const daysUnavailble: Array<string> = [];
      for (const day in days) {
        if (!days[day]) daysUnavailble.push(day);
      }
      updateAvailability([startTime, endTime], daysUnavailble);
      if (status !== 'initial') navigate('/');
    } else setTimeError(true);
  };

  useEffect(() => {
    if (status !== 'initial') {
      const localDays = { ...days };
      for (const prop in localDays) {
        localDays[prop] = true;
      }
      daysContext.forEach((d) => {
        localDays[d] = false;
      });
      setDays(localDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Style
  const InputTime = {
    fontSize: '1rem',
    fontWeight: 700,
    width: '12.808rem',
  };

  const DayBox = {
    borderLeft: 1,
    borderBottom: 1,
    width: { sm: 110, xs: '12.808rem' },
    paddingTop: '10px',
    paddingBottom: '10px',
    borderColor: 'hsl(230,30%,85%)!important',
  };

  return (
    <>
      <CssBaseline />
      <Stack direction="column" sx={{ ...OnboardPosition, marginTop: 6 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction="column" spacing={8}>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" sx={{ marginLeft: { sm: '0!important', xs: '1rem!important' } }}>
                <Typography variant="h2">Available Hours:</Typography>
                <Stack
                  direction={{ sm: 'row', xs: 'column' }}
                  sx={{
                    marginTop: 2,
                  }}
                  spacing={2}
                >
                  <TextField
                    sx={{ height: '4.75rem' }}
                    InputProps={{
                      sx: { ...InputTime },
                    }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    variant="outlined"
                    type="time"
                  />
                  <Typography sx={{ marginTop: '0.5rem!important', display: { sm: 'block', xs: 'none' } }} variant="h1">
                    -
                  </Typography>
                  <TextField
                    sx={{ height: '4.75rem' }}
                    InputProps={{
                      sx: { ...InputTime },
                    }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    variant="outlined"
                    type="time"
                    helperText={timeError ? 'Availability cannot be negative' : ''}
                    error={timeError}
                  />
                </Stack>
              </Stack>
              <Stack direction="column">
                <Typography variant="h2" sx={{ marginLeft: { sm: '0!important', xs: '1rem!important' } }}>
                  Available Days:
                </Typography>
                <Stack
                  direction={{ sm: 'row', xs: 'column' }}
                  sx={{ marginTop: 2, marginLeft: { sm: '0!important', xs: '1rem!important' } }}
                >
                  {Object.keys(days).map((day) => (
                    <Stack
                      key={day}
                      direction={{ sm: 'column', xs: 'row' }}
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        borderTop: { sm: 1, xs: day === 'Sunday' ? 1 : 0 },
                        borderRight: { sm: day === 'Saturday' ? 1 : 0, xs: 1 },
                        borderTopRightRadius: { sm: day === 'Saturday' ? '5px' : 0, xs: day === 'Sunday' ? '5px' : 0 },
                        borderBottomRightRadius: day === 'Saturday' ? '5px' : 0,
                        borderTopLeftRadius: day === 'Sunday' ? '5px' : 0,
                        borderBottomLeftRadius: {
                          sm: day === 'Sunday' ? '5px' : 0,
                          xs: day === 'Saturday' ? '5px' : 0,
                        },
                        ...DayBox,
                      }}
                    >
                      <Checkbox
                        name={day}
                        checked={days[day]}
                        onChange={(e) => setDays({ ...days, [e.target.name]: !days[e.target.name] })}
                        sx={{ color: days[day] ? 'primary.main' : 'secondary.main' }}
                      />
                      <Typography
                        sx={{ color: days[day] ? 'secondary.main' : 'secondary.light', pr: { xs: 3, sm: 0 } }}
                      >
                        {day}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
            <Stack direction="column" alignItems="center">
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
                {status === 'initial' ? 'Finish' : 'Save'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </>
  );
}
