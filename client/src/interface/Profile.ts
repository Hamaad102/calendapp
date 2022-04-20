/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';

export const retrieve_user = (url: string) => axios.post('/profile/retrieve', { url }, { withCredentials: true });
