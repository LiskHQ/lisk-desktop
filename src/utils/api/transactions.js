import Lisk from 'lisk-elements';
import { validateAddress } from '../validators';
import { tokenMap, tokenKeys } from '../../constants/tokens';
import getMappedFunction from './functionMapper';

export const send = (
  liskAPIClient,
  recipientId,
  amount,
  passphrase,
  secondPassphrase = null,
  data,
  timeOffset,
) =>
  new Promise((resolve, reject) => {
    const transaction = Lisk.transaction.transfer({
      recipientId, amount, passphrase, secondPassphrase, data, timeOffset,
    });
    liskAPIClient.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    }).catch(reject);
  });

const getTokenFromAddress = address => (
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
  limit = 25,
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

export const unconfirmedTransactions = (liskAPIClient, address, limit = 20, offset = 0, sort = 'timestamp:desc') =>
  liskAPIClient.node.getTransactions('unconfirmed', {
    senderId: address,
    limit,
    offset,
    sort,
  });
