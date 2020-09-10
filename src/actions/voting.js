import to from 'await-to-js';
import { toast } from 'react-toastify';
import {
  getVotes,
  castVotes,
} from '../utils/api/delegates';
import { getVotingLists, getVotingError } from '../utils/voting';
import { passphraseUsed } from './account';
import { addNewPendingTransaction } from './transactions';
import actionTypes from '../constants/actions';
import { getAPIClient } from '../utils/api/network';
import { tokenMap } from '../constants/tokens';
import { txAdapter } from '../utils/api/lsk/adapters';

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
