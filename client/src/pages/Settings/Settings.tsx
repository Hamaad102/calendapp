import moment from 'moment-timezone';
import { useState, useEffect, ChangeEvent } from 'react';

// Context
import { useAuth } from '../../context/useAuthContext';

// API Calls
import {
  existing_url_check,
  update_url_server,
  update_timezone_server,
  upload_image_server,
} from '../../interface/Settings';

// Components
import Navbar from '../../components/Navbar/Navbar';

// MUI
import {
  Autocomplete,
  Box,
  Button,
  Container,
  CssBaseline,
  Input,
  InputAdornment,
  Paper,
  Stack,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';

// Style
import { ButtonSize, OnboardInputSize } from '../../style/size';
import { OrangeButton, ButtonStyle } from '../../style/colors';

export default function Settings(): JSX.Element {
  // Context
  const { loggedInUser, picture, updateUrl, updateTimezone, updatePicture } = useAuth();
  const savedTimezone = useAuth().timezone;
  const savedUrl = useAuth().url;

  // State
  const [file, setFile] = useState<File>();
  const [localAvatar, setLocalAvatar] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  // Error Handler
  const [inuse, setInUse] = useState<boolean>(false);
  // User settings
  const [url, setUrl] = useState<string>(savedUrl);
  const [timezone, setTimezone] = useState(savedTimezone);

  useEffect(() => {
    setLocalAvatar(picture);
  }, [picture]);

  const updateImage = (event: ChangeEvent<HTMLInputElement>) => {
    const fileObject = event.target.files;
    if (fileObject && fileObject.length > 0) {
      setFile(fileObject[0]);
      setLocalAvatar(URL.createObjectURL(fileObject[0]));
    }
  };

  const uploadImage = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      upload_image_server(formData)
        .then((res) => {
          updatePicture(res.data.new_picture);
          setLoading(false);
          setMessage('Success');
          setOpen(true);
        })
        .catch((error) => {
          setMessage(error.response.data.error);
          setOpen(true);
          setLoading(false);
        });
    }
  };

  const handleSave = () => {
    if ((file || url !== savedUrl || timezone !== savedTimezone) && url !== '') {
      setLoading(true);
      if (url !== savedUrl) {
        existing_url_check(url).then((res) => {
          if (res.data.length === 0) update_url_server(loggedInUser?.mongoid, url).then(() => updateUrl(url));
          else {
            setInUse(true);
            setLoading(false);
          }
        });
      }
      if (timezone !== savedTimezone && !inuse)
        update_timezone_server(loggedInUser?.mongoid, timezone).then(() => updateTimezone(timezone));
      if (file && !inuse) uploadImage();
      if (!file) setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMessage('');
  };

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
                Account Settings
              </Typography>
            </Stack>

            {/* Change avatar */}
            <Stack alignItems="center" justifyContent="center" direction="row" marginTop={6} spacing={4}>
              <Box
                component="img"
                src={localAvatar}
                alt="Avatar"
                sx={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '100%',
                  marginRight: '1rem',
                }}
              />

              <Stack direction="column">
                <label htmlFor="contained-button-file">
                  <Input id="contained-button-file" type="file" onChange={updateImage} sx={{ display: 'none' }} />
                  <Button sx={{ ...ButtonStyle, ...ButtonSize }} component="span">
                    Upload Picture
                  </Button>
                </label>
                <Typography variant="h4" sx={{ fontSize: '0.8rem!important', marginTop: 1 }}>
                  JPG, PNG and WEBP. 5mb max.
                </Typography>
              </Stack>
            </Stack>

            {/* Change URL */}
            <Stack
              alignItems="center"
              sx={{
                flexDirection: 'column',
                marginLeft: { sm: '0!important', xs: '1rem!important' },
                marginTop: 6,
              }}
            >
              <Stack spacing={3}>
                <Typography sx={{ marginTop: 2 }} variant="h2">
                  Change your CalendApp URL
                </Typography>
                <TextField
                  id="url-field"
                  name="url"
                  value={url}
                  required
                  helperText={inuse ? 'URL is already in use' : ''}
                  error={inuse}
                  onChange={(e) => setUrl(e.target.value)}
                  sx={{ ...OnboardInputSize }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" component="span" style={{ fontWeight: 700 }}>
                        CalendApp.com |
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>

            {/* Change timezone */}
            <Stack
              alignItems="center"
              sx={{
                flexDirection: 'column',
                marginLeft: { sm: '0!important', xs: '1rem!important' },
                marginTop: 6,
              }}
            >
              <Stack spacing={3}>
                <Typography sx={{ marginTop: 2 }} variant="h2">
                  Change your timezone
                </Typography>
                <Autocomplete
                  id="timezone-field"
                  value={timezone}
                  sx={{ ...OnboardInputSize }}
                  options={moment.tz.names()}
                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                  onChange={(e, value) => {
                    if (typeof value === 'string') setTimezone(value);
                  }}
                />
              </Stack>
            </Stack>

            {/* Save Button */}
            <Stack alignItems="center" marginTop={8}>
              <LoadingButton
                sx={{
                  ...OrangeButton,
                  fontSize: '1rem',
                  fontWeight: 700,
                  width: '7rem',
                  height: '3rem',
                }}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                loading={loading}
                onClick={handleSave}
                variant="contained"
              >
                Save
              </LoadingButton>
            </Stack>
          </Paper>
        </Container>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={open}
          onClose={handleClose}
          message={message}
        />
      </Stack>
    </>
  );
}
