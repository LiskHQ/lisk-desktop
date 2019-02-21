import Lisk from 'lisk-elements';
import moment from 'moment';
import txFilters from './../../constants/transactionFilters';

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

// eslint-disable-next-line max-statements
export const getTransactions = ({
  liskAPIClient, address, limit = 20, offset = 0,
  sort = 'timestamp:desc', filter = txFilters.all, customFilters = {},
}) => {
  const params = {
    limit,
    offset,
    sort,
  };

  const _convertTimeFromFirstBlock = value =>
    (value - moment(new Date(2016, 4, 24, 17, 0, 0, 0)).format('x')) / 1000;

  if (customFilters.message) params.data = `%${customFilters.message}%`;
  if (customFilters.dateFrom && customFilters.dateFrom !== '') {
    const timestamp = moment(customFilters.dateFrom, 'MM-DD-YYYY').format('x');
    params.fromTimestamp = _convertTimeFromFirstBlock(timestamp);
  }
  if (customFilters.dateTo && customFilters.dateTo !== '') {
    const timestamp = moment(customFilters.dateTo, 'MM-DD-YYYY').format('x');
    params.toTimestamp = _convertTimeFromFirstBlock(timestamp);
  }
  if (filter === txFilters.incoming) params.recipientId = address;
  if (filter === txFilters.outgoing) params.senderId = address;
  if (filter === txFilters.all) params.senderIdOrRecipientId = address;
  return liskAPIClient.transactions.get(params);
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
