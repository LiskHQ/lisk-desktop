import to from 'await-to-js';
// import { tokenMap } from '@token/fungible/consts/tokens';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { signTransaction } from '@transaction/api';
import txActionTypes from '@transaction/store/actionTypes';
import { joinModuleAndCommand } from '@transaction/utils';
import { getStakes, getValidatorList } from '../../api';
import actionTypes from './actionTypes';

export const stakesReset = () => ({
  type: actionTypes.stakesReset,
});

/**
 * Clears the existing changes on votes.
 * The vote queue will be empty after this action dispatched
 *
 * @returns {Object} Pure action object
 */
export const stakesCleared = () => ({
  type: actionTypes.stakesCleared,
});

/**
 * To be dispatched when the pending vote transaction
 * is confirmed by the blockchain.
 *
 * @returns {Object} Pure action object
 */
export const stakesConfirmed = () => ({
  type: actionTypes.stakesConfirmed,
});

/**
 * To be dispatched when a vote is to be removed from the staking queue
 *
 * @returns {Object} Pure action object
 */
export const stakeDiscarded = (data) => ({
  type: actionTypes.stakeDiscarded,
  data,
});

/**
 * Defines the new vote amount for a given validator.
 * The reducer will add a new vote if if didn't exist before
 * Any vote whose vote amount changes to zero will be removed
 * when the vote transaction is confirmed (via stakesConfirmed action)
 *
 * @param {Object} data
 * @param {String} data.address - Delegate address
 * @param {String} data.name - Delegate name
 * @param {String} data.voteAmount - (New) vote amount in Beddows
 * @returns {Object} Pure action object
 */
export const stakeEdited = (data) => async (dispatch) =>
  dispatch({
    type: actionTypes.stakeEdited,
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
export const stakesSubmitted =
  (formProps, transactionJSON, privateKey, _, senderAccount, moduleCommandSchemas) =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWallet = selectActiveTokenAccount(state);
    const [error, tx] = await to(
      signTransaction({
        transactionJSON,
        wallet: activeWallet,
        schema: moduleCommandSchemas[joinModuleAndCommand(transactionJSON)],
        chainID: state.network.networks.LSK.chainID,
        privateKey,
        senderAccount,
      })
    );
    if (error) {
      dispatch({
        type: txActionTypes.transactionSignError,
        data: error,
      });
    } else {
      dispatch({ type: actionTypes.stakesSubmitted });
      dispatch({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    }
  };

/**
 * Fetches the list of votes of the host wallet.
 */
export const stakesRetrieved = () => async (dispatch, getState) => {
  const { network, account } = getState();
  const address = account.current?.metadata?.address;
  try {
    const votes = await getStakes({ network, params: { address } });
    const validators = await getValidatorList({
      addresses: votes.data.map(({ delegateAddress }) => delegateAddress),
    });
    const mapValidatorToAddress = validators.reduce((result, validator) => ({...result, [validator.address]: validator}), {})

    dispatch({
      type: actionTypes.stakesRetrieved,
      data: votes.data.map((vote) => ({...vote, commission: mapValidatorToAddress[vote.delegateAddress]}) ),
    });
  } catch (exp) {
    dispatch({
      type: actionTypes.stakesRetrieved,
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
export const balanceUnlocked =
  (formProps, transactionJSON, privateKey) => async (dispatch, getState) => {
    //
    // Collect data
    //
    const state = getState();
    const activeWallet = selectActiveTokenAccount(state);

    //
    // Create the transaction
    //
    const [error, tx] = await to(
      signTransaction({
        transactionJSON,
        wallet: activeWallet,
        schema: state.network.networks.LSK.moduleCommandSchemas[formProps.moduleCommand],
        chainID: state.network.networks.LSK.chainID,
        privateKey,
      })
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
