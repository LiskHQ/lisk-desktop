import { loadingStarted, loadingFinished } from '../../utils/loading';

import { unconfirmedTransactions, transactions as getTransactions, getAccount, transaction, extractAddress } from '../../utils/api/account';
import { getDelegate } from '../../utils/api/delegate';
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

const getAccountSuccess = (store, accountData) => {
  store.dispatch(transactionsInit(accountData));
  loadingFinished('transactions-init');
};

const initTransactions = (store, action) => {
  const state = store.getState();
  const activePeer = state.peers.data;
  const { address } = action.data;
  const lastActiveAddress = state.account ?
    extractAddress(state.account.publicKey) :
    null;
  const isSameAccount = lastActiveAddress === address;
  loadingStarted('transactions-init');

  getTransactions({ activePeer, address, limit: 25 })
    .then((txResponse) => {
      const { transactions, count } = txResponse;
      getAccount(activePeer, address)
        .then((accountData) => {
          let accountDataResult = {
            confirmed: transactions,
            count: parseInt(count, 10),
            balance: accountData.balance,
            address,
          };
          if (!isSameAccount && accountData.publicKey) {
            getDelegate(activePeer, { publicKey: accountData.publicKey })
              .then((delegateData) => {
                accountDataResult = {
                  ...accountDataResult,
                  targetDelegate: { ...delegateData.delegate },
                };
                getAccountSuccess(store, accountDataResult);
              }).catch(() => {
                getAccountSuccess(store, accountDataResult);
              });
            return;
          } else if (isSameAccount && accountData.isDelegate) {
            accountDataResult = {
              ...accountDataResult,
              targetDelegate: { ...accountData.delegate },
            };
          }
          getAccountSuccess(store, accountDataResult);
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
