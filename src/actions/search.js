import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../utils/loading';
import { transactions, getAccount } from '../utils/api/account';
import { getDelegate, getVoters, getVotes } from '../utils/api/delegate';

const searchDelegate = ({ activePeer, publicKey, address }) =>
  (dispatch) => {
    getDelegate(activePeer, { publicKey }).then((response) => {
      dispatch({
        data: {
          delegate: response.delegate,
          address,
        },
        type: actionTypes.searchDelegate,
      });
    });
  };

const searchVotes = ({ activePeer, address }) =>
  dispatch =>
    getVotes(activePeer, address).then(({ delegates }) => {
      dispatch({
        type: actionTypes.searchVotes,
        data: {
          votes: delegates,
          address,
        },
      });
    });

const searchVoters = ({ activePeer, address, publicKey }) =>
  dispatch =>
    getVoters(activePeer, publicKey).then(({ accounts }) => {
      dispatch({
        type: actionTypes.searchVoters,
        data: {
          voters: accounts,
          address,
        },
      });
    });

export const searchAccount = ({ activePeer, address }) =>
  (dispatch) => {
    dispatch(searchVotes({ activePeer, address }));
    getAccount(activePeer, address).then((response) => {
      const accountData = {
        balance: response.balance,
        address,
      };
      if (response.publicKey) {
        dispatch(searchDelegate({ activePeer, publicKey: response.publicKey, address }));
        dispatch(searchVoters({ activePeer, address, publicKey: response.publicKey }));
      }
      dispatch({ data: accountData, type: actionTypes.searchAccount });
    });
  };

export const searchTransactions = ({
  activePeer, address, limit, filter, showLoading = true,
}) =>
  (dispatch) => {
    if (showLoading) loadingStarted(actionTypes.searchTransactions);
    transactions({
      activePeer, address, limit, filter,
    })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.transactions,
            count: parseInt(transactionsResponse.count, 10),
            filter,
          },
          type: actionTypes.searchTransactions,
        });
        if (showLoading) loadingFinished(actionTypes.searchTransactions);
      });
  };

export const searchMoreTransactions = ({
  activePeer, address, limit, offset, filter,
}) =>
  (dispatch) => {
    transactions({
      activePeer, address, limit, offset, filter,
    })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.transactions,
            count: parseInt(transactionsResponse.count, 10),
            filter,
          },
          type: actionTypes.searchMoreTransactions,
        });
      });
  };
