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

export const getTokenFromAddress = address => (
  tokenKeys.find(tokenKey => validateAddress(tokenKey, address) === 0) || tokenMap.LSK.key
);

export const getTransactions = params => (
  getMappedFunction(getTokenFromAddress(params.address), 'transactions', 'getTransactions')(params)
);

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
