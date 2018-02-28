import { loadingStarted, loadingFinished } from '../../utils/loading';

import { unconfirmedTransactions, transactions as getTransactions, getAccount, transaction } from '../../utils/api/account';
import {
  transactionsFailed,
  transactionsFiltered,
  transactionsInit,
  transactionLoaded,
  transactionLoadFailed,
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


const initTransactions = (store, action) => {
  const activePeer = store.getState().peers.data;
  const address = action.data.address;
  loadingStarted('transactions-init');
  getTransactions({ activePeer, address, limit: 25 })
    .then((txResponse) => {
      const { transactions, count } = txResponse;
      getAccount(activePeer, address)
        .then((accountResponse) => {
          store.dispatch(transactionsInit({
            confirmed: transactions,
            count: parseInt(count, 10),
            balance: accountResponse.balance,
            address,
          }));
          loadingFinished('transactions-init');
        });
    });
};

const loadTransaction = (store, action) => {
  transaction({ activePeer: store.getState().peers.data, id: action.data.id })
    .then((response) => {
      store.dispatch(transactionLoaded({ ...response }));
    }).catch((error) => {
      store.dispatch(transactionLoadFailed({ error }));
    })
  ;
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
    case actionTypes.transactionsRequestInit:
      initTransactions(store, action);
      break;
    case actionTypes.transactionLoadRequested:
      loadTransaction(store, action);
      break;
    default: break;
  }
};

export default transactionsMiddleware;
