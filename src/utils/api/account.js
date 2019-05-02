import { getTokenFromAddress } from './transactions';
import getMappedFunction from './functionMapper';

/* eslint-disable-next-line import/prefer-default-export */
export const getAccount = async ({ token, ...params }) => (
  getMappedFunction(token || getTokenFromAddress(params.address), 'account', 'getAccount')(params)
);
