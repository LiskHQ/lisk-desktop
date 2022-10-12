/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { createGenericTx } from '@transaction/api';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import transactionActionTypes from '@transaction/store/actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const delegateRegistered = (
  transactionObject,
  privateKey,
) => async (dispatch, getState) => {
  const state = getState();
  const activeWallet = selectActiveTokenAccount(state);
  //
  // Create the transaction
  //
  const [error, tx] = await to(createGenericTx({
    transactionObject,
    wallet: activeWallet,
    schema: state.network.networks.LSK.moduleCommandSchemas[transactionObject.moduleCommand],
    chainID: state.network.networks.LSK.chainID,
    privateKey,
  }));

  //
  // Dispatch corresponding action
  //
  if (!error) {
    dispatch({
      type: transactionActionTypes.transactionCreatedSuccess,
      data: tx,
    });
  } else {
    dispatch({
      type: transactionActionTypes.transactionSignError,
      data: error,
    });
  }
};
