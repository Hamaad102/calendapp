/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';

export const checkout_session = (priceInCents: number, name: string) =>
  axios.post('/payment/create-checkout-session', { priceInCents, name }, { withCredentials: true });

export const checkout_success = (id: string | undefined, stripeid: string | undefined) =>
  axios.post('/payment/success', { id, stripeid }, { withCredentials: true });
