import { to } from 'await-to-js';
import { signTransaction } from '@transaction/api';
import actionTypes from '@transaction/store/actionTypes';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { selectCurrentApplicationChainID } from '@blockchainApplication/manage/store/selectors';

export const balanceReclaimed =
  (formProps, transactionJSON, privateKey, _, txInitiatorAccount, moduleCommandSchemas) =>
  async (dispatch, getState) => {
    //
    // Collect data
    //
    const state = getState();
    const wallet = state.account?.current?.hw
      ? state.account.current
      : selectActiveTokenAccount(state);

    //
    // Create the transaction
    //
    const [error, tx] = await to(
      signTransaction({
        privateKey,
        transactionJSON,
        wallet,
        schema: moduleCommandSchemas[formProps.moduleCommand],
        chainID: selectCurrentApplicationChainID(state),
        senderAccount: txInitiatorAccount,
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
