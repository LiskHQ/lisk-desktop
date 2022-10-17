// @todo: this should be re-instated when the issue with lisk-client is fixed
/* istanbul ignore file */
import { to } from 'await-to-js';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import actionTypes from '@transaction/store/actionTypes';
import { createGenericTx } from '@transaction/api/index';

/**
 * Calls transactionAPI.create for create the tx object that will broadcast
 * @param {Object} data
 * @param {String} data.recipientAddress
 * @param {Number} data.amount - In raw format (beddows)
 * @param {Number} data.fee - In raw format, used for updating the TX List.
 * @param {Number} data.reference - Data field for LSK transactions
 */

export const tokensTransferred = (
  transactionObject,
  privateKey,
) => async (dispatch, getState) => {
  const state = getState();
  const wallet = selectActiveTokenAccount(state);

  const [error, tx] = await to(
    createGenericTx({
      transactionObject,
      wallet,
      schema: state.network.networks.LSK.moduleCommandSchemas[transactionObject.moduleCommand],
      chainID: state.network.networks.LSK.chainID,
      privateKey,
    }),
  );

  if (error) {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  } else {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
  }
};
