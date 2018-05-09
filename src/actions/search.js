import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../utils/loading';
import { transactions, getAccount } from '../utils/api/account';
import { getDelegate } from '../utils/api/delegate';

const searchDelegate = ({ activePeer, publicKey }) =>
  (dispatch) => {
    getDelegate(activePeer, { publicKey }).then((response) => {
      dispatch({ data: response.delegate, type: actionTypes.searchDelegateLoaded });
    });
  };

export const searchAccount = ({ activePeer, address }) =>
  (dispatch) => {
    getAccount(activePeer, address).then((response) => {
      const accountData = {
        balance: response.balance,
        address,
      };
      if (response.publicKey) {
        dispatch(searchDelegate({ activePeer, publicKey: response.publicKey }));
      }
      dispatch({ data: accountData, type: actionTypes.searchAccountLoaded });
    });
  };

export const searchTransactions = ({ activePeer, address, limit, filter, showLoading = true }) =>
  (dispatch) => {
    if (showLoading) loadingStarted(actionTypes.searchTransactionsLoaded);
    transactions({ activePeer, address, limit, filter })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.transactions,
            count: parseInt(transactionsResponse.count, 10),
            filter,
          },
          type: actionTypes.searchTransactionsLoaded,
        });
        if (showLoading) loadingFinished(actionTypes.searchTransactionsLoaded);
      });
  };

export const searchMoreTransactions = ({ activePeer, address, limit, offset, filter }) =>
  (dispatch) => {
    transactions({ activePeer, address, limit, offset, filter })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.transactions,
            count: parseInt(transactionsResponse.count, 10),
            filter,
          },
          type: actionTypes.searchMoreTransactionsLoaded,
        });
      });
  };
