import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { getAccount } from '../utils/api/account';
import { getTransactions } from '../utils/api/transactions';
import { getDelegate, getVoters, getAllVotes } from '../utils/api/delegate';
import searchAll from '../utils/api/search';

const searchDelegate = ({ publicKey, address }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
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

const searchVotes = ({ address }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getAllVotes(activePeer, address).then(response =>
      dispatch({
        type: actionTypes.searchVotes,
        data: {
          votes: response.data.votes,
          address,
        },
      }));
  };

const searchVoters = ({
  address, publicKey, offset, limit, append,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getVoters(activePeer, {
      publicKey, offset, limit,
    }).then(response =>
      dispatch({
        type: actionTypes.searchVoters,
        data: {
          append: append || false,
          voters: response.data.voters,
          votersSize: response.data.votes,
          address,
        },
      }));
  };

export const searchMoreVoters = ({ address, offset = 0, limit = 100 }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getAccount(activePeer, address).then((response) => {
      const accountData = {
        ...response,
      };
      if (accountData.publicKey) {
        dispatch(searchVoters({
          address, publicKey: accountData.publicKey, offset, limit, append: true,
        }));
      }
    });
  };

export const searchAccount = ({ address }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    dispatch(searchVotes({ address }));
    getAccount(activePeer, address).then((response) => {
      const accountData = {
        ...response,
      };
      if (accountData.publicKey) {
        dispatch(searchDelegate({ publicKey: accountData.publicKey, address }));
        dispatch(searchVoters({ address, publicKey: accountData.publicKey }));
      }
      dispatch({ data: accountData, type: actionTypes.searchAccount });
    });
  };

export const searchTransactions = ({
  address, limit, filter, showLoading = true,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    if (showLoading) dispatch(loadingStarted(actionTypes.searchTransactions));
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
        if (showLoading) dispatch(loadingFinished(actionTypes.searchTransactions));
      });
  };

export const searchMoreTransactions = ({
  address, limit, offset, filter,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
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

export const searchSuggestions = ({ searchTerm }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    dispatch({
      data: {},
      type: actionTypes.searchClearSuggestions,
    });
    searchAll({ activePeer, searchTerm }).then(response => dispatch({
      data: response,
      type: actionTypes.searchSuggestions,
    }));
  };
