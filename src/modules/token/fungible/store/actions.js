// @todo: this should be re-instated when the issue with lisk-client is fixed
/* istanbul ignore file */
import { to } from 'await-to-js';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import actionTypes from '@transaction/store/actionTypes';
import { signTransaction } from '@transaction/api/index';

/**
 * Calls transactionAPI.create for create the tx object that will broadcast
 * @param {Object} data
 * @param {String} data.recipientAddress
 * @param {Number} data.amount - In raw format (beddows)
 * @param {Number} data.fee - In raw format, used for updating the TX List.
 * @param {Number} data.reference - Data field for LSK transactions
 */

export const tokensTransferred =
  (formProps, transactionJSON, privateKey, _, senderAccount, moduleCommandSchemas) =>
  async (dispatch, getState) => {
    const state = getState();
    const activeTokenAccount = selectActiveTokenAccount(state);
    const wallet = state.account?.current?.metadata?.isHW
      ? state.account.current
      : activeTokenAccount;
    const [error, tx] = await to(
      signTransaction({
        transactionJSON,
        wallet,
        schema: moduleCommandSchemas[formProps.moduleCommand],
        chainID: formProps.fields.sendingChain.chainID,
        privateKey,
        senderAccount,
      })
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
