import to from 'await-to-js';
import {
  actionTypes, loginTypes, tokenMap, MODULE_ASSETS_NAME_ID_MAP,
} from '@constants';
import { create, computeTransactionId } from '@api/transaction';
import { getAccount } from '@api/account';
import { signTransactionByHW } from '@utils/hwManager';
import { getVotes } from '@api/delegate';
import { timerReset } from './account';

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
    const account = await getAccount({
      network, params: { address: vote.address },
    }, settings.token.active);
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
 */
export const votesSubmitted = ({ fee, votes }) =>
  async (dispatch, getState) => { // eslint-disable-line max-statements
    const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.voteDelegate;
    const { network, account } = getState();
    const senderPublicKey = account.info.LSK.summary.publicKey;
    const nonce = account.info.LSK.sequence.nonce;

    const transaction = {
      fee, votes, nonce, senderPublicKey,
    };
    const params = {
      network,
      account: account.info.LSK,
      transactionObject: {
        ...transaction,
        moduleAssetId,
      },
      isHwSigning: account.loginType !== loginTypes.passphrase.code,
    };

    let [error, tx] = await to(create(params, tokenMap.LSK.key));

    if (error) {
      dispatch({
        type: actionTypes.transactionSignError,
        data: error,
      });
      return;
    }

    if (params.isHwSigning) {
      // tx contain transactionObject and transactionBytes that needs to be signed by HW
      [error, tx] = await to(signTransactionByHW(
        account,
        tx.networkIdentifier,
        tx.transactionObject,
        tx.transactionBytes,
      ));
      tx.id = computeTransactionId({ transaction: tx });
    }

    if (error) {
      dispatch({
        type: actionTypes.transactionSignError,
        data: error,
      });

      return;
    }

    dispatch({ type: actionTypes.votesSubmitted });
    dispatch(timerReset());
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
  };

/**
 * Fetches the list of votes of the host account.
 */
export const votesRetrieved = () =>
  async (dispatch, getState) => {
    const { account, network } = getState();
    const address = account.info[tokenMap.LSK.key].summary.address;
    const votes = await getVotes({ network, params: { address } });

    dispatch({
      type: actionTypes.votesRetrieved,
      data: votes.data,
    });
  };
