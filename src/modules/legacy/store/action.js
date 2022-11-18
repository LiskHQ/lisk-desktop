import { to } from 'await-to-js';
import { signTransaction } from '@transaction/api';
import actionTypes from '@transaction/store/actionTypes';
import { selectActiveTokenAccount } from 'src/redux/selectors';

export const balanceReclaimed =
  (formProps, transactionJSON, privateKey, _, txInitatorAccount, moduleCommandSchemas) =>
  async (dispatch, getState) => {
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
        privateKey,
        transactionJSON,
        wallet: activeWallet,
        schema: moduleCommandSchemas[formProps.moduleCommand],
        chainID: state.network.networks.LSK.chainID,
        senderAccount: txInitatorAccount,
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
