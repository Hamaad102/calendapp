/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';

export const login = () => axios.get('/auth/user', { withCredentials: true });

export const demo = () => axios.get('/auth/demo', { withCredentials: true });

export const logout_call = () => axios.get('/auth/logout', { withCredentials: true });

export const existing_url_check = (url: string) => axios.post('/setting/existing', { url }, { withCredentials: true });

export const save_availability = (
  id: string | undefined,
  url: string,
  timezone: string,
  hours: Array<string>,
  days: Array<string>,
) => axios.post('/setting/save', { id, url, timezone, hours, days }, { withCredentials: true });

export const update_url_server = (_id: string | undefined, url: string) =>
  axios.post('/setting/updateUrl', { _id, url }, { withCredentials: true });

export const update_timezone_server = (_id: string | undefined, timezone: string) =>
  axios.post('/setting/updateTimezone', { _id, timezone }, { withCredentials: true });

export const upload_image_server = (formData: FormData) =>
  axios.post('/setting/picture/upload', formData, { withCredentials: true });
