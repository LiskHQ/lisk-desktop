import { to } from 'await-to-js';
import { createGenericTx } from '@transaction/api';
import actionTypes from '@transaction/store/actionTypes';
import { selectActiveTokenAccount } from 'src/redux/selectors';

export const balanceReclaimed = (
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
