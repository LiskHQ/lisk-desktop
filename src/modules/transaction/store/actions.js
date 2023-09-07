import { to } from 'await-to-js';
import { getTransactionSignatureStatus } from '@wallet/components/signMultisigView/helpers';
import { selectCurrentAccountWithSigningData } from 'src/redux/selectors';
import { selectCurrentApplicationChainID } from '@blockchainApplication/manage/store/selectors';
import actionTypes from './actionTypes';
import { broadcast, dryRunTransaction, signTransaction } from '../api';
import { joinModuleAndCommand, signMultisigTransaction } from '../utils';
import { fromTransactionJSON, toTransactionJSON } from '../utils/encoding';

/**
 * Action trigger when user logout from the application
 * the transactions reducer is set to initial state
 */
export const emptyTransactionsData = () => ({ type: actionTypes.emptyTransactionsData });

/**
 * Action trigger after a new transaction is broadcasted to the network
 * then the transaction is add to the pending transaction array in transaction reducer
 * Used in:  Send, Stake, and validator registration.
 */
export const pendingTransactionAdded = (data) => ({
  type: actionTypes.pendingTransactionAdded,
  data,
});

export const resetTransactionResult = () => ({
  type: actionTypes.resetTransactionResult,
});

/**
 * Calls transactionAPI.broadcast function for put the tx object (signed) into the network
 */
export const transactionBroadcasted =
  (transaction, moduleCommandSchemas) =>
  // eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    const { network, token } = getState();
    const activeToken = token.active;
    const serviceUrl = network.networks[activeToken].serviceUrl;
    const moduleCommand = joinModuleAndCommand(transaction);
    const paramsSchema = moduleCommandSchemas[moduleCommand];
    let broadcastErrorMessage;

    const { isOk, errorMessage } = await dryRunTransaction({
      paramsSchema,
      transaction,
      skipVerify: false,
      strict: true,
    });

    if (isOk) {
      const [broadcastError, broadcastResult] = await to(
        broadcast({ transaction, serviceUrl, moduleCommandSchemas })
      );
      broadcastErrorMessage = broadcastError?.response?.data?.message || broadcastError?.message;

      if (!broadcastResult?.data?.error && !broadcastError) {
        const transactionJSON = toTransactionJSON(transaction, paramsSchema);
        dispatch({
          type: actionTypes.broadcastedTransactionSuccess,
          data: transaction,
        });
        dispatch(pendingTransactionAdded({ ...transactionJSON, isPending: true }));

        return true;
      }
    }

    dispatch({
      type: actionTypes.broadcastedTransactionError,
      data: {
        error: broadcastErrorMessage || errorMessage,
        transaction,
        paramsSchema,
      },
    });

    return false;
  };

/**
 * Signs a given multisignature transaction using passphrase
 * and dispatches the relevant action.
 */
export const multisigTransactionSigned =
  ({
    formProps,
    transactionJSON,
    sender,
    privateKey,
    txInitiatorAccount,
    moduleCommandSchemas,
    messagesSchemas,
  }) =>
  async (dispatch, getState) => {
    const state = getState();
    const wallet = selectCurrentAccountWithSigningData(state);
    const txStatus = getTransactionSignatureStatus(sender, transactionJSON);
    const options = {
      messageSchema: messagesSchemas[formProps.moduleCommand],
      txInitiatorAccount,
    };
    const [tx, error] = await signMultisigTransaction(
      wallet,
      sender,
      transactionJSON,
      txStatus,
      moduleCommandSchemas[formProps.moduleCommand],
      selectCurrentApplicationChainID(state),
      privateKey,
      txInitiatorAccount, // this is the initiator of the transaction wanting to be signed
      options
    );

    if (!error) {
      dispatch({
        type: actionTypes.transactionSigned,
        data: tx,
      });
    } else {
      dispatch({
        type: actionTypes.transactionSignError,
        data: error,
      });
    }
  };

/**
 * Used when a fully signed transaction is imported, this action
 * skips the current user's signature and directly places the tx
 * in the Redux store to be ready for broadcasting.
 */
export const signatureSkipped =
  ({ formProps, transactionJSON }) =>
  (dispatch, getState) => {
    const { network } = getState();
    const schema = network.networks.LSK.moduleCommandSchemas[formProps.moduleCommand];
    const transactionObject = fromTransactionJSON(transactionJSON, schema);

    dispatch({
      type: actionTypes.signatureSkipped,
      data: transactionObject,
    });
  };

export const transactionSigned =
  (formProps, transactionJSON, privateKey, _, senderAccount) => async (dispatch, getState) => {
    const { schema, chainID } = formProps;
    const state = getState();
    const wallet = selectCurrentAccountWithSigningData(state);

    const [error, tx] = await to(
      signTransaction({
        transactionJSON,
        wallet,
        schema,
        chainID,
        privateKey,
        senderAccount,
      })
    );

    if (!error) {
      dispatch({
        type: actionTypes.transactionSigned,
        data: tx,
      });
    } else {
      dispatch({
        type: actionTypes.transactionSignError,
        data: error,
      });
    }
  };
