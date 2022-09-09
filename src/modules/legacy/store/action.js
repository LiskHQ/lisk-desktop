import { to } from 'await-to-js';
import { createGenericTx } from '@transaction/api';
import actionTypes from '@transaction/store/actionTypes';
import { selectActiveTokenAccount } from 'src/redux/selectors';

// eslint-disable-next-line import/prefer-default-export
export const balanceReclaimed =
  (transactionObject, privateKey, publicKey) => async (dispatch, getState) => {
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
        privateKey,
        publicKey,
      })
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
