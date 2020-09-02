import { validateAddress } from '../validators';
import { tokenMap, tokenKeys } from '../../constants/tokens';
import api from '.';
import networks from '../../constants/networks';

export const getTokenFromAddress = address => (
  [networks.mainnet.code, networks.testnet.code]
    .map(code => tokenKeys.find(tokenKey => validateAddress(tokenKey, address, code) === 0))
    .find(key => key)
);

const getTokenFromTransactionId = id => (
  id && id.length === 64 ? tokenMap.BTC.key : tokenMap.LSK.key
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

/**
 * This functions are not test it because all the purpose is just
 * pass parameters to another functions
 */
// istanbul ignore file
export const get = (token, data) => api[token].transactions.get(data);

/**
 * @todo Use transfer from '@liskhq/lisk-transactions'
 * @todo Implement the dynamic fee
 * @todo Use nonce
 * @todo document function signature
 *
 */
export const create = (tokenType, data, transactionType) =>
  api[tokenType].transactions.create(data, transactionType);

/**
 * @todo document function signature
 */
export const broadcast = (tokenType, transaction, networkConfig) =>
  api[tokenType].transactions.broadcast(transaction, networkConfig);

export const getTransactionBaseFees = tokenType =>
  api[tokenType].transactions.getTransactionBaseFees();

export const getTransactionFee = ({ token, ...params }) =>
  api[token].transactions.getTransactionFee(params);

export default {
  broadcast,
  create,
  get,
  getSingleTransaction,
  getTokenFromAddress,
  getTransactions,
};
