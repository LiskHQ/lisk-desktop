import { to } from 'await-to-js';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import actionTypes from '@transaction/store/actionTypes';
import { createGenericTx } from '@transaction/api/index';

/**
 * Calls transactionAPI.create for create the tx object that will broadcast
 * @param {Object} data
 * @param {String} data.recipientAddress
 * @param {Number} data.amount - In raw format (satoshi, beddows)
 * @param {Number} data.fee - In raw format, used for updating the TX List.
 * @param {Number} data.reference - Data field for LSK transactions
 */
// eslint-disable-next-line import/prefer-default-export
export const tokensTransferred = (
  transactionObject,
  privateKey,
  publicKey,
) => async (dispatch, getState) => {
  const state = getState();
  const wallet = selectActiveTokenAccount(state);

  const [error, tx] = await to(
    createGenericTx({
      transactionObject,
      wallet,
      network: state.network,
      privateKey,
      publicKey,
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
