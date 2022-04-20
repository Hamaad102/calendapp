import { useState, useEffect } from 'react';

// Context
import { useAuth } from '../../../../context/useAuthContext';

// API Calls
import { create_event, update_event } from '../../../../interface/Event';

// MUI
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Container, Modal, Radio, Stack, TextField, Typography } from '@mui/material';

// Style
import { OrangeButton } from '../../../../style/colors';

interface Details {
  openModal: boolean;
  description: string;
  duration: string;
  color: string;
  eventId: string;
  handleModalClose: () => void;
}

export default function Details({
  openModal,
  description,
  duration,
  color,
  eventId,
  handleModalClose,
}: Details): JSX.Element {
  // Context
  const { loggedInUser, updateEvents } = useAuth();

  // State
  const [modalDesc, setModalDesc] = useState<string>('');
  const [modalDura, setModalDura] = useState<string>('');
  const [modalColor, setModalColor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const push_to_server = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (eventId !== '') {
      const oldEvent = `${duration}/${color}/${description}/${eventId}`;
      const newEvent = `${modalDura}/${modalColor}/${modalDesc}/${eventId}`;
      update_event(loggedInUser?.mongoid, oldEvent, newEvent).then((res) => {
        updateEvents(res.data.events);
        handleModalClose();
        setLoading(false);
      });
    } else {
      const newEvent = `${modalDura}/${modalColor}/${modalDesc}`;
      create_event(loggedInUser?.mongoid, newEvent).then((res) => {
        updateEvents(res.data.events);
        handleModalClose();
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    setModalDesc(description);
    setModalDura(duration);
    setModalColor(color);
  }, [description, duration, color]);

  return (
    <Modal
      open={openModal}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={{ height: '100%', pb: '2rem', marginTop: { sm: '10vh', xs: '2rem' } }}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            bgcolor: 'white',
            boxShadow: 24,
            py: 8,
          }}
        >
          <form onSubmit={push_to_server}>
            <Stack spacing={5}>
              <Typography variant="h1" sx={{ textAlign: 'center' }}>
                {eventId !== '' ? 'Update Event' : 'New Event'}
              </Typography>

              {/* Description */}
              <Stack spacing={2}>
                <Typography variant="h2">Description</Typography>
                <TextField defaultValue={modalDesc} required onChange={(e) => setModalDesc(e.target.value)} />
              </Stack>

              {/* Duration */}
              <Stack spacing={2}>
                <Typography variant="h2">Duration</Typography>
                <Autocomplete
                  value={modalDura}
                  options={['15', '30', '45', '60']}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(e, value) => {
                    if (typeof value === 'string') setModalDura(value);
                  }}
                />
              </Stack>

              {/* Color */}
              <Stack spacing={2}>
                <Typography variant="h2">Color</Typography>
                <Stack direction="row" spacing={{ sm: 5, xs: 1 }}>
                  <Radio
                    checked={modalColor === '#7900ff'}
                    onChange={(e) => setModalColor(e.target.value)}
                    value="#7900ff"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Purple' }}
                    style={{ color: '#7900ff' }}
                  />
                  <Radio
                    checked={modalColor === '#89b800'}
                    onChange={(e) => setModalColor(e.target.value)}
                    value="#89b800"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Green' }}
                    style={{ color: '#89b800' }}
                  />
                  <Radio
                    checked={modalColor === '#ff4f26'}
                    onChange={(e) => setModalColor(e.target.value)}
                    value="#ff4f26"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Red' }}
                    style={{ color: '#ff4f26' }}
                  />
                  <Radio
                    checked={modalColor === '#ff7000'}
                    onChange={(e) => setModalColor(e.target.value)}
                    value="#ff7000"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Orange' }}
                    style={{ color: '#ff7000' }}
                  />
                  <Radio
                    checked={modalColor === '#40e0d0'}
                    onChange={(e) => setModalColor(e.target.value)}
                    value="#40e0d0"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Turquoise' }}
                    style={{ color: '#40e0d0' }}
                  />
                  <Radio
                    checked={modalColor === '#019afb'}
                    onChange={(e) => setModalColor(e.target.value)}
                    value="#019afb"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Blue' }}
                    style={{ color: '#019afb' }}
                  />
                </Stack>
              </Stack>

              <Stack direction="column" alignItems="center">
                {eventId !== '' ? (
                  <LoadingButton
                    sx={{
                      ...OrangeButton,
                      border: 0,
                      borderRadius: 1,
                      height: '3rem',
                      padding: '0 30px',
                      fontSize: '1rem',
                    }}
                    type="submit"
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    loading={loading}
                    variant="contained"
                  >
                    {eventId !== '' ? 'Save Changes' : 'Create Event'}
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    sx={{
                      ...OrangeButton,
                      border: 0,
                      borderRadius: 1,
                      height: '3rem',
                      padding: '0 30px',
                      fontSize: '1rem',
                    }}
                    type="submit"
                    loadingPosition="end"
                    endIcon={<SendIcon />}
                    loading={loading}
                    variant="contained"
                  >
                    {eventId !== '' ? 'Save Changes' : 'Create Event'}
                  </LoadingButton>
                )}
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Modal>
  );
}
