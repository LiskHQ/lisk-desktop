import { getTokenFromAddress } from './transactions';
import api from '.';

// TODO this import is temporary until api is implemented for it
import { setSecondPassphrase as ssp } from './lsk/account';

export const setSecondPassphrase = ssp;

/* eslint-disable-next-line import/prefer-default-export */
export const getAccount = async ({ token, ...params }) => (
  api[token || getTokenFromAddress(params.address)].account.getAccount(params)
);
