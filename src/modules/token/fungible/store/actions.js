// @todo: this should be re-instated when the issue with lisk-client is fixed
/* istanbul ignore file */
import { to } from 'await-to-js';
import { selectCurrentAccountWithSigningData } from 'src/redux/selectors';
import actionTypes from '@transaction/store/actionTypes';
import { signTransaction } from '@transaction/api/index';
import { selectCurrentApplicationChainID } from '@blockchainApplication/manage/store/selectors';

export const tokensTransferred =
  (formProps, transactionJSON, privateKey, _, senderAccount, moduleCommandSchemas) =>
  async (dispatch, getState) => {
    const state = getState();
    const wallet = selectCurrentAccountWithSigningData(state);
    const [error, tx] = await to(
      signTransaction({
        transactionJSON,
        wallet,
        privateKey,
        senderAccount,
        schema: moduleCommandSchemas[formProps.moduleCommand],
        chainID: selectCurrentApplicationChainID(state),
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
