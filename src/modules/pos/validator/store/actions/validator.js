/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { signTransaction } from '@transaction/api';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import transactionActionTypes from '@transaction/store/actionTypes';
import { selectCurrentApplicationChainID } from '@blockchainApplication/manage/store/selectors';

export const validatorRegistered =
  (formProps, transactionJSON, privateKey, _, senderAccount, moduleCommandSchemas) =>
  async (dispatch, getState) => {
    const state = getState();
    const wallet = state.account?.current?.hw
      ? state.account.current
      : selectActiveTokenAccount(state);
    //
    // Create the transaction
    //
    const [error, tx] = await to(
      signTransaction({
        transactionJSON,
        privateKey,
        wallet,
        schema: moduleCommandSchemas[formProps.moduleCommand],
        chainID: selectCurrentApplicationChainID(state),
        senderAccount,
      })
    );
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
