import { to } from 'await-to-js';
import { signTransaction } from '@transaction/api';
import actionTypes from '@transaction/store/actionTypes';
import { selectCurrentAccountWithSigningData } from 'src/redux/selectors';
import { selectCurrentApplicationChainID } from '@blockchainApplication/manage/store/selectors';

export const balanceReclaimed =
  (formProps, transactionJSON, privateKey, _, txInitiatorAccount, moduleCommandSchemas) =>
  async (dispatch, getState) => {
    //
    // Collect data
    //
    const state = getState();
    const wallet = selectCurrentAccountWithSigningData(state);

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
