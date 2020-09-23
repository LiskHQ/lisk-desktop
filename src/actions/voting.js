import to from 'await-to-js';
import {
  getVotes,
} from '../utils/api/delegates';
import { create } from '../utils/api/lsk/transactions';
import { passphraseUsed } from './account';
import actionTypes from '../constants/actions';
import { loginType } from '../constants/hwConstants';
import transactionTypes from '../constants/transactionTypes';
import { signVoteTransaction } from '../utils/hwManager';

/**
 * Clears the existing changes on votes.
 * The vote queue will be empty after this action dispatched
 *
 * @returns {Object} Pure action object
 */
export const votesCleared = () => ({
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
 * @param {String} data.address - Delegate address
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
export const votesSubmitted = data =>
  async (dispatch, getState) => { // eslint-disable-line max-statements
    const { network, account } = getState();

    const [error, tx] = account.loginType === loginType.normal
      ? await to(create(
        { ...data, network },
        transactionTypes().vote.key,
      ))
      : await to(signVoteTransaction(account, data));

    if (error) {
      return dispatch({
        type: actionTypes.transactionCreatedError,
        data: error,
      });
    }

    dispatch({ type: actionTypes.votesSubmitted });
    dispatch(passphraseUsed(new Date()));
    return dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
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
          data: response.data,
        });
      });
  };
