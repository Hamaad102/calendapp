import { useState } from 'react';

// API Calls
import { delete_event } from '../../../../interface/Event';

// Context
import { useAuth } from '../../../../context/useAuthContext';

// Components
import Details from '../Details/Details';

// MUI
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Button, Divider, Grid, Menu, MenuItem, Modal, Stack, Typography } from '@mui/material';

// Style
import { ButtonStyle, OrangeButton } from '../../../../style/colors';

export default function EventBox(): JSX.Element {
  // Context
  const { loggedInUser, url, events, updateEvents } = useAuth();

  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Edit Modal State
  const [openModal, setModalOpen] = useState<boolean>(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // Delete Modal State
  const [openDelModal, setDelModalOpen] = useState<boolean>(false);
  const handleDelModalOpen = () => setDelModalOpen(true);
  const handleDelModalClose = () => setDelModalOpen(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Selected Event
  const [duration, setDuration] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [eventId, setEventId] = useState<string>('');

  const deleteEvent = () => {
    const delEvent = `${duration}/${color}/${description}/${eventId}`;
    console.log(delEvent);
    delete_event(loggedInUser?.mongoid, delEvent).then((res) => {
      updateEvents(res.data.events);
      handleDelModalClose();
      setLoading(false);
    });
  };

  // Style
  const EventStyle = {
    borderRadius: '5px',
    background: 'snow',
    width: { sm: 'auto', xs: '90vw' },
    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  };

  const ButtonSize = {
    border: '2px solid',
    fontSize: '0.9rem',
    fontWeight: 700,
  };

  return (
    <Grid container direction={{ sm: 'row', xs: 'column' }} alignItems={{ sm: '', xs: 'center' }} spacing={6}>
      {events.map((event) => {
        const values = event.split('/');
        return (
          <Grid key={values[3]} item md={4} sm={6} xs={12}>
            <Stack direction="column" sx={{ ...EventStyle, borderTop: `8px solid ${values[1]}`, py: 2 }}>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  onClick={handleMenuClick}
                  id={event}
                  sx={{
                    '&:hover': {
                      background: 'secondary',
                    },
                  }}
                >
                  <SettingsOutlinedIcon sx={{ fontSize: '1.5rem', color: 'secondary.light' }} />
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      const info = anchorEl?.id.split('/');
                      if (info !== undefined) {
                        setDuration(info[0]);
                        setColor(info[1]);
                        setDescription(info[2]);
                        setEventId(info[3]);
                      }
                      handleModalOpen();
                      handleMenuClose();
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      const info = anchorEl?.id.split('/');
                      if (info !== undefined) {
                        setDuration(info[0]);
                        setColor(info[1]);
                        setDescription(info[2]);
                        setEventId(info[3]);
                      }
                      handleDelModalOpen();
                      handleMenuClose();
                    }}
                  >
                    Delete Event
                  </MenuItem>
                </Menu>
              </Stack>
              <Stack direction="column" spacing={1} sx={{ pl: 2, pb: 6 }}>
                <Typography variant="h1">{values[0]} minute meeting</Typography>
                <Typography variant="h4" sx={{ color: 'hsl(0,0%,60%)' }}>
                  {values[2]}
                </Typography>
              </Stack>
              <Divider />
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, pt: 2 }}>
                <Stack direction="row" spacing={1}>
                  <AccessTimeIcon />
                  <Typography sx={{ fontWeight: 700 }}>{values[0]} min</Typography>
                </Stack>
                <Button
                  sx={{ ...ButtonSize, ...ButtonStyle }}
                  onClick={() => {
                    navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/${url}/${values[3]}`);
                  }}
                >
                  Copy Link
                </Button>
              </Stack>
            </Stack>
          </Grid>
        );
      })}
      <Modal
        open={openDelModal}
        onClose={handleDelModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { sm: 400, xs: 300 },
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stack spacing={5}>
            <Typography variant="h1" sx={{ textAlign: 'center', lineHeight: 1.5 }}>
              Delete {description}
              <br />
              {duration} minute meeting?
            </Typography>
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
              onClick={deleteEvent}
            >
              Delete
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
      <Details
        openModal={openModal}
        description={description}
        duration={duration}
        color={color}
        eventId={eventId}
        handleModalClose={handleModalClose}
      />
    </Grid>
  );
}
