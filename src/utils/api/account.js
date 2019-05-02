import { getTokenFromAddress } from './transactions';
import getMappedFunction from './functionMapper';

// TODO this import is temporary until getMappedFunction is implemented for it
import { setSecondPassphrase as ssp } from './lsk/account';

export const setSecondPassphrase = ssp;

/* eslint-disable-next-line import/prefer-default-export */
export const getAccount = async ({ token, ...params }) => (
  getMappedFunction(token || getTokenFromAddress(params.address), 'account', 'getAccount')(params)
);
