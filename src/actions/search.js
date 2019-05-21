import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { getAccount } from '../utils/api/account';
import { getDelegate, getVotes, listDelegates } from '../utils/api/delegate';
import { getTransactions } from '../utils/api/transactions';
import { getBlocks } from '../utils/api/blocks';
import searchAll from '../utils/api/search';
import transactionTypes from '../constants/transactionTypes';
import { updateWallet } from './wallets';
import { tokenMap } from '../constants/tokens';

const searchDelegate = ({ publicKey, address }) =>
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const networkConfig = getState().network;
    const token = tokenMap.LSK.key;
    const delegates = await getDelegate(liskAPIClient, { publicKey });
    const transactions = await getTransactions({
      token, networkConfig, address, limit: 1, type: transactionTypes.registerDelegate,
    });
    const block = await getBlocks(liskAPIClient, { generatorPublicKey: publicKey, limit: 1 });
    dispatch({
      data: {
        delegate: {
          ...delegates.data[0],
          lastBlock: (block.data[0] && block.data[0].timestamp) || '-',
          txDelegateRegister: transactions.data[0],
        },
        address,
      },
      type: actionTypes.searchDelegate,
    });
  };


export const fetchVotedDelegateInfo = (votes, {
  showingVotes = 30, address, offset = 0, limit = 101, filter = '',
}) =>
  // eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore if */
    if (!liskAPIClient) return;
    dispatch(loadingStarted(actionTypes.searchVotes));
    const delegates = await listDelegates(liskAPIClient, { limit, offset });
    const votesWithDelegateInfo = votes.map((vote) => {
      const delegate = delegates.data.find(d => d.username === vote.username) || {};
      return { ...vote, ...delegate };
    }).sort((a, b) => {
      if (!a.rank && !b.rank) return 0;
      if (!a.rank || +a.rank > +b.rank) return 1;
      return -1;
    });

    const filteredVotes = votesWithDelegateInfo.filter(vote => RegExp(filter, 'i').test(vote.username));
    const lastIndex = showingVotes > filteredVotes.length ?
      filteredVotes.length : showingVotes;
    if (filteredVotes.length && !filteredVotes[lastIndex - 1].rank) {
      dispatch(fetchVotedDelegateInfo(votesWithDelegateInfo, {
        offset: offset + limit,
        address,
        showingVotes,
        filter,
      }));
    } else {
      dispatch({
        type: actionTypes.searchVotes,
        data: { votes: votesWithDelegateInfo, address },
      });
      dispatch(loadingFinished(actionTypes.searchVotes));
    }
  };

const searchVotes = ({ address, offset, limit }) =>
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore if */
    if (!liskAPIClient) return;
    dispatch(loadingStarted(actionTypes.searchVotes));
    const votes = await getVotes(liskAPIClient, { address, offset, limit })
      .then(res => res.data.votes || [])
      .catch(() => dispatch(loadingFinished(actionTypes.searchVotes)));

    dispatch({
      type: actionTypes.searchVotes,
      data: { votes, address },
    });
    dispatch(loadingFinished(actionTypes.searchVotes));
  };

export const searchAccount = ({ address }) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;
    /* istanbul ignore else */
    if (networkConfig) {
      getAccount({ networkConfig, address }).then((response) => {
        const accountData = {
          ...response,
        };
        if (accountData.delegate && accountData.delegate.username) {
          searchDelegate({ publicKey: accountData.publicKey, address })(dispatch, getState);
        }
        dispatch({ data: accountData, type: actionTypes.searchAccount });
        dispatch(updateWallet(response, getState().peers));
        if (accountData.token === tokenMap.LSK.key) {
          searchVotes({ address, offset: 0, limit: 101 })(dispatch, getState);
        }
      });
    }
  };

export const searchTransactions = ({
  address, limit, filter, showLoading = true, customFilters = {},
  actionType = actionTypes.searchTransactions,
}) =>
  (dispatch, getState) => {
    // TODO move assembling filters outside of this action in
    // https://github.com/LiskHQ/lisk-hub/issues/2025
    const filters = {
      ...customFilters,
      direction: filter,
    };
    const networkConfig = getState().network;
    if (showLoading) dispatch(loadingStarted(actionType));
    /* istanbul ignore else */
    if (networkConfig) {
      getTransactions({
        networkConfig, address, limit, filters,
      })
        .then((transactionsResponse) => {
          dispatch({
            data: {
              address,
              transactions: transactionsResponse.data,
              count: parseInt(transactionsResponse.meta.count, 10) || 0,
              filters,
            },
            type: actionType,
          });
          if (filter !== undefined && actionType === actionTypes.searchTransactions) {
            dispatch({
              data: {
                filterName: 'transactions',
                value: filter,
              },
              type: actionTypes.addFilter,
            });
          }
          if (showLoading) dispatch(loadingFinished(actionType));
        });
    }
  };

export const searchMoreTransactions = params => (
  searchTransactions({
    ...params,
    actionType: actionTypes.searchMoreTransactions,
  })
);

export const clearSearchSuggestions = () => ({
  data: {},
  type: actionTypes.searchClearSuggestions,
});

export const searchSuggestions = ({ searchTerm }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    searchAll({ liskAPIClient, searchTerm }).then(response => dispatch({
      data: response,
      type: actionTypes.searchSuggestions,
    }));
  };
