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
 * Clears the existing changes on votes.
 * The vote queue will be empty after this action dispatched
 *
 * @returns {Object} Pure action object
 */
export const clearVotes = () => ({
  type: actionTypes.votesCleared,
});

/**
 * To be dispatched when the pending vote transaction
 * is confirmed by the blockchain.
 *
 * @returns {Object} Pure action object
 */
export const votesConfirmed = () => ({
  type: actionTypes.votesConfirmed,
});

/**
 * Defines the new vote amount for a given delegate.
 * The reducer will add a new vote if if didn't exist before
 * Any vote whose vote amount changes to zero will be removed
 * when the vote transaction is confirmed (via votesConfirmed action)
 *
 * @param {Object} data
 * @param {String} data.username - Delegate username
 * @param {String} data.publicKey - Delegate public key
 * @param {String} data.address - Delegate account address
 * @param {String} data.voteAmount - (New) vote amount in Beddows
 * @returns {Object} Pure action object
 */
export const voteEdited = data => ({
  type: actionTypes.voteEdited,
  data,
});

/**
 * Makes Api call to register votes
 * Adds pending state and then after the duration of one round
 * cleans the pending state
 */
export const votesSubmitted = ({
  account, votes,
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

    const result = await castVotes({
      liskAPIClient,
      account,
      votedList,
      unvotedList,
      networkIdentifier,
    });

    if (result.error) {
      // What should I do?
    }

    dispatch({ type: actionTypes.votesSubmitted });
    // @todo Should I do these here or in a middleware?
    dispatch(passphraseUsed(new Date()));
    addNewPendingTransaction(txAdapter(result.data)); // @todo fix the param when API ready
  };

/**
 * Fetches the list of votes of the host account.
 */
export const votesRetrieved = () =>
  (dispatch, getState) => {
    const { network, account } = getState();

    getVotes(network, { address: account.info.LSK.address })
      .then((response) => {
        dispatch({
          type: actionTypes.votesRetrieved,
          data: response.data.votes,
        });
      });
  };
