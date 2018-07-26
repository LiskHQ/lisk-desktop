import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../utils/loading';
import { getAccount } from '../utils/api/account';
import { getTransactions } from '../utils/api/transactions';
import { getDelegate, getVoters, getVotes } from '../utils/api/delegate';
import searchAll from '../utils/api/search';

const searchDelegate = ({ activePeer, publicKey, address }) =>
  (dispatch) => {
    getDelegate(activePeer, { publicKey }).then((response) => {
      dispatch({
        data: {
          delegate: response.data[0],
          address,
        },
        type: actionTypes.searchDelegate,
      });
    });
  };

const searchVotes = ({ activePeer, address }) =>
  dispatch =>
    getVotes(activePeer, address).then(response =>
      dispatch({
        type: actionTypes.searchVotes,
        data: {
          votes: response.data.votes,
          address,
        },
      }));

const searchVoters = ({ activePeer, address, publicKey }) =>
  dispatch =>
    getVoters(activePeer, publicKey).then(response =>
      dispatch({
        type: actionTypes.searchVoters,
        data: {
          voters: response.data.voters,
          address,
        },
      }));

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
    getTransactions({
      activePeer, address, limit, filter,
    })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.data,
            count: parseInt(transactionsResponse.meta.count, 10) || 0,
            filter,
          },
          type: actionTypes.searchTransactions,
        });
        if (filter !== undefined) {
          dispatch({
            data: {
              filterName: 'transactions',
              value: filter,
            },
            type: actionTypes.addFilter,
          });
        }
        if (showLoading) loadingFinished(actionTypes.searchTransactions);
      });
  };

export const searchMoreTransactions = ({
  activePeer, address, limit, offset, filter,
}) =>
  (dispatch) => {
    getTransactions({
      activePeer, address, limit, offset, filter,
    })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.data,
            count: parseInt(transactionsResponse.meta.count, 10),
            filter,
          },
          type: actionTypes.searchMoreTransactions,
        });
      });
  };

export const searchSuggestions = ({ activePeer, searchTerm }) =>
  (dispatch) => {
    dispatch({
      data: {},
      type: actionTypes.searchClearSuggestions,
    });
    searchAll({ activePeer, searchTerm }).then(response => dispatch({
      data: response,
      type: actionTypes.searchSuggestions,
    }));
  };
