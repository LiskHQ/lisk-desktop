import store from '../store';
import { transactionsRequested, transactionsFilterSet } from '../actions/transactions';

export const loadTransactions = ({ filter, offset = 0 }) => {
  store.dispatch(transactionsRequested({
    activePeer: store.getState().peers.data,
    address: store.getState().account.address,
    limit: 20,
    offset,
    filter,
  }));
};

export const setFilterAndReload = ({ filter, offset }) => {
  store.dispatch(transactionsFilterSet({ filter }));
  loadTransactions({ filter, offset });
};
