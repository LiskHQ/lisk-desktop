import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { getAccount } from '../utils/api/account';
import { getDelegate, getVoters, getVotes, listDelegates } from '../utils/api/delegate';
import { getTransactions } from '../utils/api/transactions';
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
        getBlocks(liskAPIClient, { generatorPublicKey: publicKey, limit: 1 }).then((block) => {
          dispatch({
            data: {
              delegate: {
                ...response.data[0],
                lastBlock: (block.data[0] && block.data[0].timestamp) || '-',
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


export const searchVotesDelegate = (votes, {
  showingVotes = 30, address, offset = 0, limit = 101,
}) =>
  // eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    if (!liskAPIClient) return;
    dispatch(loadingStarted(actionTypes.searchVotes));
    const delegates = await listDelegates(liskAPIClient, { limit, offset });
    const mergedVotes = votes.map((vote) => {
      const delegate = delegates.data.find(d => d.username === vote.username) || {};
      return { ...vote, ...delegate };
    }).sort((a, b) => {
      if (!a.rank && !b.rank) return 0;
      if (!a.rank || +a.rank > +b.rank) return 1;
      return -1;
    });

    const lastIndex = showingVotes > mergedVotes.length ?
      mergedVotes.length : showingVotes;
    if (mergedVotes.length && !mergedVotes[lastIndex - 1].rank) {
      dispatch(searchVotesDelegate(mergedVotes, {
        offset: offset + limit,
        address,
        showingVotes,
      }));
    } else {
      dispatch({
        type: actionTypes.searchVotes,
        data: { votes: mergedVotes, address },
      });
      dispatch(loadingFinished(actionTypes.searchVotes));
    }
  };

const searchVotes = ({ address, offset, limit }) =>
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore else */
    if (!liskAPIClient) return;
    dispatch(loadingStarted(actionTypes.searchVotes));
    const votes = await getVotes(liskAPIClient, { address, offset, limit })
      .then(res => res.data.votes);

    dispatch({
      type: actionTypes.searchVotes,
      data: { votes, address },
    });
    dispatch(searchVotesDelegate(votes, { address, limit: 30 }));
    dispatch(loadingFinished(actionTypes.searchVotes));
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
      dispatch(searchVotes({ address, offset: 0, limit: 101 }));
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
