/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';

export const update_event = (_id: string | undefined, oldEvent: string, newEvent: string) =>
  axios.post('/event/update', { _id, oldEvent, newEvent }, { withCredentials: true });

export const create_event = (_id: string | undefined, newEvent: string) =>
  axios.post('/event/create', { _id, newEvent }, { withCredentials: true });

export const delete_event = (_id: string | undefined, deleteEvent: string) =>
  axios.post('/event/delete', { _id, deleteEvent }, { withCredentials: true });
