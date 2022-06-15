import { to } from 'await-to-js';
import { createGenericTx } from '@transaction/api';
import actionTypes from '@transaction/store/actionTypes';
import { selectActiveTokenAccount } from '@common/store';

// eslint-disable-next-line import/prefer-default-export
export const balanceReclaimed = (transactionObject) => async (dispatch, getState) => {
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
      network: state.network,
      wallet: activeWallet,
      transactionObject,
    }),
  );

  //
  // Dispatch corresponding action
  //
  if (!error) {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
  } else {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  }
};
