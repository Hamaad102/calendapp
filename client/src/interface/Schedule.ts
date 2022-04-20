/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';

export const retrieveScheduledEvents = (mongoid: string, selectedDay: string | undefined) =>
  axios.post('/schedule/retrieve', { _id: mongoid, selectedDay }, { withCredentials: true });

export const bookMeeting = (
  mongoid: string,
  selectedDay: string,
  selectedEvent: Array<string>,
  startTimeGoogle: string,
  endTimeGoogle: string,
  ownerStartTime: string,
  ownerEndTime: string,
  name: string,
  email: string,
  userTimezone: string,
) =>
  axios.post(
    '/schedule/book',
    {
      _id: mongoid,
      selectedDay,
      selectedEvent,
      startTimeGoogle,
      endTimeGoogle,
      ownerStartTime,
      ownerEndTime,
      name,
      email,
      userTimezone,
    },
    { withCredentials: true },
  );

export const deleteMeeting = (mongoid: string, eventId: string) =>
  axios.post('/schedule/delete', { _id: mongoid, eventId }, { withCredentials: true });

export const getMeetingInfo = (mongoid: string, eventId: string) =>
  axios.post('/schedule/meeting', { _id: mongoid, eventId }, { withCredentials: true });
