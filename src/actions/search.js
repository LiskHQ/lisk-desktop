import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { getAccount } from '../utils/api/account';
import { getTransactions } from '../utils/api/transactions';
import { getDelegate, getVoters, getAllVotes } from '../utils/api/delegate';
import { getBlocks } from '../utils/api/blocks';
import searchAll from '../utils/api/search';
import transactionTypes from '../constants/transactionTypes';
import { updateWallet } from './wallets';

const searchDelegate = ({ publicKey, address }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    getDelegate(liskAPIClient, { publicKey }).then((response) => {
      getTransactions({
        liskAPIClient, address, limit: 1, type: transactionTypes.registerDelegate,
      }).then((transactions) => {
        getBlocks(liskAPIClient, { publicKey, limit: 1 }).then((block) => {
          dispatch({
            data: {
              delegate: {
                ...response.data[0],
                lastBlock: block.data[0],
                txDelegateRegister: transactions.data[0],
              },
              address,
            },
            type: actionTypes.searchDelegate,
          });
        });
      });
    });
  };

const searchVotes = ({ address }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore else */
    if (liskAPIClient) {
      getAllVotes(liskAPIClient, address).then(response =>
        dispatch({
          type: actionTypes.searchVotes,
          data: {
            votes: response.data.votes,
            address,
          },
        }));
    }
  };

const searchVoters = ({
  address, publicKey, offset, limit, append,
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore else */
    if (liskAPIClient) {
      getVoters(liskAPIClient, {
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
    }
  };

export const searchMoreVoters = ({ address, offset = 0, limit = 100 }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    getAccount(liskAPIClient, address).then((response) => {
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
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore else */
    if (liskAPIClient) {
      dispatch(searchVotes({ address }));
      getAccount(liskAPIClient, address).then((response) => {
        const accountData = {
          ...response,
        };
        if (accountData.publicKey) {
          dispatch(searchDelegate({ publicKey: accountData.publicKey, address }));
          dispatch(searchVoters({ address, publicKey: accountData.publicKey }));
        }
        dispatch({ data: accountData, type: actionTypes.searchAccount });
        dispatch(updateWallet(response, getState().peers));
      });
    }
  };

export const searchTransactions = ({
  address, limit, filter, showLoading = true, customFilters = {},
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    if (showLoading) dispatch(loadingStarted(actionTypes.searchTransactions));
    if (liskAPIClient) {
      getTransactions({
        liskAPIClient, address, limit, filter, customFilters,
      })
        .then((transactionsResponse) => {
          dispatch({
            data: {
              address,
              transactions: transactionsResponse.data,
              count: parseInt(transactionsResponse.meta.count, 10) || 0,
              filter,
              customFilters,
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
    }
  };

export const searchMoreTransactions = ({
  address, limit, offset, filter, customFilters = {},
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    dispatch(loadingStarted(actionTypes.searchMoreTransactions));
    getTransactions({
      liskAPIClient, address, limit, offset, filter, customFilters,
    })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.data,
            count: parseInt(transactionsResponse.meta.count, 10),
            filter,
            customFilters,
          },
          type: actionTypes.searchMoreTransactions,
        });
        dispatch(loadingFinished(actionTypes.searchMoreTransactions));
      });
  };

export const searchSuggestions = ({ searchTerm }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    dispatch({
      data: {},
      type: actionTypes.searchClearSuggestions,
    });
    searchAll({ liskAPIClient, searchTerm }).then(response => dispatch({
      data: response,
      type: actionTypes.searchSuggestions,
    }));
  };
