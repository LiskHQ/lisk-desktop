import { validateAddress } from '../validators';
import { tokenMap, tokenKeys } from '../../constants/tokens';
import getMappedFunction from './functionMapper';

// TODO these imports are temporary until getMappedFunction is implemented for them
import { send as ss, unconfirmedTransactions as ut } from './lsk/transactions';

export const send = ss;
export const unconfirmedTransactions = ut;

export const getTokenFromAddress = address => (
  // TODO remove the localStorage condition after BTC features is enabled.
  localStorage.getItem('btc') ?
    tokenKeys.find(tokenKey => validateAddress(tokenKey, address) === 0) :
    /* istanbul ignore next */
    tokenMap.LSK.key
);

const getTokenFromTransactionId = id => (
  // TODO remove the localStorage condition after BTC features is enabled.
  // eslint-disable-next-line no-nested-ternary
  localStorage.getItem('btc') ?
    (id && id.length === 64 ? tokenMap.BTC.key : tokenMap.LSK.key) :
    /* istanbul ignore next */
    tokenMap.LSK.key
);

export const getTransactions = ({
  offset = 0,
  limit = 30,
  token,
  ...params
}) => (
  getMappedFunction(token || getTokenFromAddress(params.address), 'transactions', 'getTransactions')({
    offset,
    limit,
    ...params,
  })
);

export const getSingleTransaction = async ({ token, ...params }) => (
  getMappedFunction(token || getTokenFromTransactionId(params.id), 'transactions', 'getSingleTransaction')(params)
);

/**
 * This functions are not test it because all the purpose is just
 * pass parameters to another functions
 */
// istanbul ignore file
export const get = (tokenType, data) => getMappedFunction(tokenType, 'transactions', 'get')(data);
// istanbul ignore next
export const create = (tokenType, data) => getMappedFunction(tokenType, 'transactions', 'create')(data);
// istanbul ignore next
export const broadcast = (tokenType, transaction, networkConfig) => getMappedFunction(tokenType, 'transactions', 'broadcast')(transaction, networkConfig);

export default {
  broadcast,
  create,
  get,
  getSingleTransaction,
  getTokenFromAddress,
  getTransactions,
  send,
  unconfirmedTransactions,
};
