import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../utils/loading';
import { transactions, getAccount } from '../utils/api/account';
import { getDelegate } from '../utils/api/delegate';

const searchDelegate = ({ activePeer, publicKey }) =>
  (dispatch) => {
    loadingStarted(actionTypes.searchDelegateLoaded);
    getDelegate(activePeer, { publicKey }).then((response) => {
      dispatch({ data: response.delegate, type: actionTypes.searchDelegateLoaded });
      loadingFinished(actionTypes.searchDelegateLoaded);
    });
  };

const searchAccount = ({ activePeer, address }) =>
  (dispatch) => {
    loadingStarted(actionTypes.searchAccountLoaded);
    getAccount(activePeer, address).then((response) => {
      const accountData = {
        balance: response.balance,
        address,
      };
      dispatch(searchDelegate({ activePeer, publicKey: response.publicKey }));
      dispatch({ data: accountData, type: actionTypes.searchAccountLoaded });
      loadingFinished(actionTypes.searchAccountLoaded);
    });
  };

export const searchTransactions = ({ activePeer, address, limit, filter }) =>
  (dispatch) => {
    loadingStarted(actionTypes.searchTransactionsLoaded);
    dispatch(searchAccount({ activePeer, address }));
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
        loadingFinished(actionTypes.searchTransactionsLoaded);
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
