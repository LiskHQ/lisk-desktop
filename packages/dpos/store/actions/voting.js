import to from 'await-to-js';
import {
  actionTypes, tokenMap, MODULE_ASSETS_NAME_ID_MAP,
} from '@common/configuration';
import { create } from '@common/utilities/api/transaction';
import { getAccount } from '@common/utilities/api/account';
import { getVotes } from '@common/utilities/api/delegate';
import { isEmpty } from '@common/utilities/helpers';
import { timerReset } from '@wallet/store/action';

export const votesReset = () => ({
  type: actionTypes.votesReset,
});

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
export const voteEdited = data => async (dispatch, getState) => {
  const { network, settings } = getState();
  const normalizedVotes = await Promise.all(data.map(async (vote) => {
    if (vote.username) {
      return vote;
    }
    const account = (await getAccount({
      network, params: { address: vote.address },
    }, settings.token.active)) || {};
    const username = account.dpos?.delegate?.username ?? '';

    return { ...vote, username };
  }));

  return dispatch({
    type: actionTypes.voteEdited,
    data: normalizedVotes,
  });
};

/**
 * Makes Api call to register votes
 * Adds pending state and then after the duration of one round
 * cleans the pending state
 *
 * @param {object} data
 * @param {object} data.fee
 * @param {object} data.votes
 * @param {promise} API call response
 */
export const votesSubmitted = ({ fee, votes }) =>
  async (dispatch, getState) => {
    const state = getState();
    // @todo Fix this by #3898
    const activeAccount = {
      ...state.account.info.LSK,
      hwInfo: isEmpty(state.account.hwInfo) ? undefined : state.account.hwInfo,
      passphrase: state.account.passphrase,
    };

    const [error, tx] = await to(create({
      network: state.network,
      account: activeAccount,
      transactionObject: {
        fee,
        votes,
        nonce: activeAccount.sequence.nonce,
        senderPublicKey: activeAccount.summary.publicKey,
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
      },
    }, tokenMap.LSK.key));

    if (error) {
      dispatch({
        type: actionTypes.transactionSignError,
        data: error,
      });
    } else {
      dispatch({ type: actionTypes.votesSubmitted });
      dispatch(timerReset());
      dispatch({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    }
  };

/**
 * Fetches the list of votes of the host account.
 */
export const votesRetrieved = () =>
  async (dispatch, getState) => {
    const { account, network } = getState();
    const address = account.info[tokenMap.LSK.key].summary.address;
    try {
      const votes = await getVotes({ network, params: { address } });
      dispatch({
        type: actionTypes.votesRetrieved,
        data: votes.data,
      });
    } catch (exp) {
      dispatch({
        type: actionTypes.votesRetrieved,
        data: {
          account: {},
        },
      });
    }
  };
