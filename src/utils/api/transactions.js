import { validateAddress } from '../validators';
import { tokenMap, tokenKeys } from '../../constants/tokens';
import api from './';

// TODO these imports are temporary until api is implemented for them
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
  api[token || getTokenFromAddress(params.address)].transactions.getTransactions({
    offset,
    limit,
    ...params,
  })
);

export const getSingleTransaction = async ({ token, ...params }) => (
  api[token || getTokenFromTransactionId(params.id)].transactions.getSingleTransaction(params)
);
