import to from 'await-to-js';
import { toast } from 'react-toastify';
import {
  getVotes,
  getDelegates,
  castVotes,
} from '../utils/api/delegates';
import { getVotingLists, getVotingError } from '../utils/voting';
import { updateDelegateCache } from '../utils/delegates';
import { passphraseUsed } from './account';
import { addNewPendingTransaction } from './transactions';
import actionTypes from '../constants/actions';
import { getAPIClient } from '../utils/api/network';
import { tokenMap } from '../constants/tokens';
import { txAdapter } from '../utils/api/lsk/adapters';

/**
 * Add data to the list of all delegates
 *
 * This action is used in delegatesListView to clear delegates
 * https://github.com/LiskHQ/lisk-desktop/blob/d284b32f747e6b5c9189a3aeeff975b13a7a466b/src/components/delegatesListView/index.js#L21-L23
 */
export const delegatesAdded = data => ({
  type: actionTypes.delegatesAdded,
  data,
});

/**
 * Toggles account's vote for the given delegate
 */
export const voteToggled = data => ({
  type: actionTypes.voteToggled,
  data,
});

export const clearVotes = () => ({
  type: actionTypes.votesCleared,
});


/**
 * Makes Api call to register votes
 * Adds pending state and then after the duration of one round
 * cleans the pending state
 */
export const votePlaced = ({
  account, votes, secondPassphrase, callback,
}) =>
  async (dispatch, getState) => { // eslint-disable-line max-statements
    const state = getState();
    const { networkIdentifier } = state.network.networks.LSK;
    const liskAPIClient = getAPIClient(tokenMap.LSK.key, state.network);
    const { votedList, unvotedList } = getVotingLists(votes);

    const label = getVotingError(votes, account);
    if (label) {
      toast.error(label);
      return;
    }

    const [error, callResult] = await to(castVotes({
      liskAPIClient,
      account,
      votedList,
      unvotedList,
      secondPassphrase,
      networkIdentifier,
    }));

    if (error) {
      callback({
        success: false,
        error,
      });
    } else {
      dispatch({ type: actionTypes.pendingVotesAdded });
      callResult.map(transaction =>
        dispatch(addNewPendingTransaction(txAdapter(transaction))));
      dispatch(passphraseUsed(new Date()));
      callback({ success: true });
    }
  };

/**
 * Gets the list of delegates current account has voted for
 *
 */
export const loadVotes = ({ address, type, callback = () => null }) =>
  (dispatch, getState) => {
    const { network } = getState();

    getVotes(network, { address })
      .then((response) => {
        dispatch({
          type: type === 'update' ? actionTypes.votesUpdated : actionTypes.votesAdded,
          data: { list: response.data.votes },
        });
        callback(response.data.votes);
      });
  };

/**
 * Gets list of all delegates
 */
export const loadDelegates = ({
  offset = 0, q, network,
}) => {
  let params = {
    offset,
    limit: '90',
    sort: 'totalVotesReceived:desc',
  };
  params = q ? { ...params, search: q } : params;
  return getDelegates(network, params);
};

export const delegatesLoaded = ({
  offset = 0, refresh, q, callback = () => {},
}) =>
  (dispatch, getState) => {
    loadDelegates({ offset, q, network: getState().network })
      .then((response) => {
        updateDelegateCache(response.data, getState().network);
        dispatch(delegatesAdded({
          list: response.data,
          refresh,
        }));
        callback(response);
      })
      .catch(callback);
  };
