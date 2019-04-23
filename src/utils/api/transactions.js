import Lisk from 'lisk-elements';
import { getTransactions as getLSKTransactions } from './lsk/transactions';
import { get as getBTCTransactions } from './btc/transactions';
import txFilters from './../../constants/transactionFilters';
import { validateAddress } from '../validators';
import { tokenMap, tokenKeys } from '../../constants/tokens';

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

const transactionsGetterrs = {
  [tokenMap.BTC.key]: getBTCTransactions,
  [tokenMap.LSK.key]: getLSKTransactions,
};

const getTokenFromAddress = address => (
  tokenKeys.find(tokenKey => validateAddress(tokenKey, address) === 0) || tokenMap.LSK.key
);

export const getTransactions = ({
  liskAPIClient, address, limit = 20, offset = 0, type = undefined,
  sort = 'timestamp:desc', filter = txFilters.all, customFilters = {},
}) => {
  const tokenKey = getTokenFromAddress(address);
  return transactionsGetterrs[tokenKey] && transactionsGetterrs[tokenKey]({
    liskAPIClient, address, limit, offset, type, sort, filter, customFilters,
  });
};

export const getSingleTransaction = ({ liskAPIClient, id }) => new Promise((resolve, reject) => {
  if (!liskAPIClient) {
    reject();
  } else {
    liskAPIClient.transactions.get({ id })
      .then((response) => {
        if (response.data.length !== 0) {
          resolve(response);
        } else {
          resolve(liskAPIClient.node.getTransactions('unconfirmed', { id }).then(resp => resp));
        }
      });
  }
});

export const unconfirmedTransactions = (liskAPIClient, address, limit = 20, offset = 0, sort = 'timestamp:desc') =>
  liskAPIClient.node.getTransactions('unconfirmed', {
    senderId: address,
    limit,
    offset,
    sort,
  });
