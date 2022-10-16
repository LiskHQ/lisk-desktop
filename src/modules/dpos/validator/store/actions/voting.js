import to from 'await-to-js';
// import { tokenMap } from '@token/fungible/consts/tokens';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { createGenericTx } from '@transaction/api';
import { timerReset } from '@auth/store/action';
import txActionTypes from '@transaction/store/actionTypes';
import { getVotes } from '../../api';
import actionTypes from './actionTypes';

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
 * @param {String} data.name - Delegate name
 * @param {String} data.voteAmount - (New) vote amount in Beddows
 * @returns {Object} Pure action object
 */
export const voteEdited = (data) => async (dispatch) => dispatch({
    type: actionTypes.voteEdited,
    data,
  });

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
export const votesSubmitted = (
  transactionObject,
  privateKey,
) =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWallet = selectActiveTokenAccount(state);

    const [error, tx] = await to(createGenericTx({
      transactionObject,
      wallet: activeWallet,
      schema: state.network.networks.LSK.moduleCommandSchemas[transactionObject.moduleCommand],
      chainID: state.network.networks.LSK.chainID,
      privateKey,
    }));

    if (error) {
      dispatch({
        type: txActionTypes.transactionSignError,
        data: error,
      });
    } else {
      dispatch({ type: actionTypes.votesSubmitted });
      dispatch(timerReset());
      dispatch({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    }
  };

/**
 * Fetches the list of votes of the host wallet.
 */
export const votesRetrieved = () => async (dispatch, getState) => {
  const { network, account } = getState();
  const address = account.current?.metadata?.address;

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

/**
 * Submits unlock balance transactions
 *
 * @param {object} data
 * @param {string} data.selectedFee
 * @returns {promise}
 */
export const balanceUnlocked = (
  transactionObject,
  privateKey,
) => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const activeWallet = selectActiveTokenAccount(state);

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    createGenericTx({
      transactionObject,
      wallet: activeWallet,
      schema: state.network.networks.LSK.moduleCommandSchemas[transactionObject.moduleCommand],
      chainID: state.network.networks.LSK.chainID,
      privateKey,
    }),
  );

    //
    // Dispatch corresponding action
    //
    if (!error) {
      dispatch({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    } else {
      dispatch({
        type: txActionTypes.transactionSignError,
        data: error,
      });
    }
  };
