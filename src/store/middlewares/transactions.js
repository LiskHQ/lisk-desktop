import { unconfirmedTransactions, transactions as getTransactions } from '../../utils/api/account';

import {
  transactionsFailed,
  transactionsFiltered,
} from '../../actions/transactions';

import actionTypes from '../../constants/actions';

const transactionsUpdated = (store) => {
  const { transactions, account, peers } = store.getState();
  if (transactions.pending.length) {
    unconfirmedTransactions(peers.data, account.address)
      .then(response => store.dispatch(transactionsFailed({
        failed: transactions.pending.filter(tx =>
          response.transactions.filter(unconfirmedTx => tx.id === unconfirmedTx.id).length === 0),
      })));
  }
};

const filterTransactions = (store, action) => {
  getTransactions({
    activePeer: store.getState().peers.data,
    address: store.getState().transactions.account.address,
    limit: 25,
    filter: action.data.filter })
    .then((response) => {
      store.dispatch(transactionsFiltered({
        confirmed: response.transactions,
        count: parseInt(response.count, 10),
        filter: action.data.filter,
      }));
    });
};

const transactionsMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.transactionsUpdated:
      transactionsUpdated(store, action);
      break;
    case actionTypes.transactionsFilterSet:
      filterTransactions(store, action);
      break;
    default: break;
  }
};

export default transactionsMiddleware;
