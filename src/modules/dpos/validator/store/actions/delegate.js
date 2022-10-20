/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { signTransaction } from '@transaction/api';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import transactionActionTypes from '@transaction/store/actionTypes';

export const delegateRegistered = (
  formProps,
  transactionJSON,
  privateKey,
) => async (dispatch, getState) => {
  const state = getState();
  const activeWallet = selectActiveTokenAccount(state);
  //
  // Create the transaction
  //
  const [error, tx] = await to(signTransaction({
    transactionJSON,
    wallet: activeWallet,
    schema: state.network.networks.LSK.moduleCommandSchemas[formProps.moduleCommand],
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
