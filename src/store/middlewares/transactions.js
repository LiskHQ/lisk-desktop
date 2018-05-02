import { transactions as getTransactions } from '../../utils/api/account';

import {
  transactionsFiltered,
} from '../../actions/transactions';

import actionTypes from '../../constants/actions';

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
    case actionTypes.transactionsFilterSet:
      filterTransactions(store, action);
      break;
    default: break;
  }
};

export default transactionsMiddleware;
