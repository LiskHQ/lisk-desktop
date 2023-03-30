import { DEFAULT_LIMIT } from 'src/utils/monitor';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { extractKeyPair } from '@wallet/utils/account';
import { getTransactionSignatureStatus } from '@wallet/components/signMultisigView/helpers';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { loadingStarted, loadingFinished } from 'src/modules/common/store/actions';
import { selectCurrentApplicationChainID } from '@blockchainApplication/manage/store/selectors';
import actionTypes from './actionTypes';
import { getTransactions, broadcast, dryRun } from '../api';
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
 * @param {Object} params - all params
 * @param {String} params.senderPublicKey - alphanumeric string
 */
export const pendingTransactionAdded = (data) => ({
  type: actionTypes.pendingTransactionAdded,
  data,
});

/**
 * Action trigger for retrieving any amount of transactions
 * for Dashboard and Wallet components
 *
 * @param {Object} params - Object with all params.
 * @param {String} params.address - address of the wallet to fetch the transactions for
 * @param {Number} params.limit - amount of transactions to fetch
 * @param {Number} params.offset - index of the first transaction
 * @param {Object} params.filters - object with filters for the filer dropdown
 *   (e.g. minAmount, maxAmount, message, minDate, maxDate)
 */
export const transactionsRetrieved =
  ({ address, limit = DEFAULT_LIMIT, offset = 0, filters = {} }) =>
  async (dispatch, getState) => {
    dispatch(loadingStarted(actionTypes.transactionsRetrieved));

    const { network } = getState();

    const params = {
      address,
      ...filters,
      limit,
      offset,
    };

    try {
      const { data, meta } = await getTransactions({ network, params });
      dispatch({
        type: actionTypes.transactionsRetrieved,
        data: {
          offset,
          address,
          filters,
          confirmed: data,
          count: meta.total,
        },
      });
    } catch (error) {
      dispatch({
        type: actionTypes.transactionLoadFailed,
        data: { error },
      });
    } finally {
      dispatch(loadingFinished(actionTypes.transactionsRetrieved));
    }
  };

export const resetTransactionResult = () => ({
  type: actionTypes.resetTransactionResult,
});

/**
 * Signs the transaction using a given second passphrase
 *
 * @param {object} data
 * @param {string} data.secondPass
 */
// eslint-disable-next-line max-statements
export const transactionDoubleSigned = (moduleCommandSchemas) => async (dispatch, getState) => {
  const state = getState();
  const { transactions, network } = state;
  const keyPair = await extractKeyPair({
    passphrase: state.wallet.secondPassphrase,
    enableCustomDerivationPath: false,
  });
  const activeWallet = selectActiveTokenAccount(state);
  const transaction = toTransactionJSON(
    transactions.signedTransaction,
    moduleCommandSchemas[transactions.moduleCommand]
  );
  const [signedTx, err] = await signMultisigTransaction(
    activeWallet,
    // SenderAccount is the same of the double-signer
    {
      ...activeWallet.keys,
      ...activeWallet.keys,
    },
    transaction,
    signatureCollectionStatus.partiallySigned,
    moduleCommandSchemas[transactions.moduleCommand],
    network.networks.LSK.chainID,
    keyPair.privateKey
  );

  if (!err) {
    dispatch({
      type: actionTypes.transactionDoubleSigned,
      data: signedTx,
    });
  } else {
    dispatch({
      type: actionTypes.transactionSignError,
      data: err,
    });
  }
};

/**
 * Calls transactionAPI.broadcast function for put the tx object (signed) into the network
 * @param {Object} transaction
 * @param {String} transaction.recipientAddress
 * @param {Number} transaction.amount - In raw format (satoshi, beddows)
 * @param {Number} transaction.fee - In raw format, used for updating the TX List.
 * @param {Number} transaction.reference - Data field for LSK transactions
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
    let broadcastResult;
    const dryRunResult = await dryRun({ transaction, serviceUrl, paramsSchema });

    if (dryRunResult.data?.result === 1) {
      broadcastResult = await broadcast({ transaction, serviceUrl, moduleCommandSchemas });

      if (!broadcastResult.data?.error) {
        const transactionJSON = toTransactionJSON(transaction, paramsSchema);
        dispatch({
          type: actionTypes.broadcastedTransactionSuccess,
          data: transaction,
        });
        dispatch(pendingTransactionAdded({ ...transactionJSON, isPending: true }));

        return true;
      }
      // @todo we need to push pending transaction to the query cache
      // https://github.com/LiskHQ/lisk-desktop/issues/4698 should handle this logic
    }

    if (dryRunResult.data?.result === -1) {
      dispatch({
        type: actionTypes.broadcastedTransactionError,
        data: {
          error: dryRunResult.data?.errorMessage,
          transaction,
        },
      });
    }

    if (dryRunResult.data?.result === 0) {
      // @TODO: Prepare error message by parsing the events based on each transaction type
      // https://github.com/LiskHQ/lisk-desktop/issues/4698 should resolve all the dry run related logic along with feedback
      const temporaryError = dryRunResult.data?.events.map((e) => e.name).join(', ');
      dispatch({
        type: actionTypes.broadcastedTransactionError,
        data: {
          error: temporaryError,
          transaction,
        },
      });
    }

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
    const activeWallet = selectActiveTokenAccount(state);
    const txStatus = getTransactionSignatureStatus(sender, transactionJSON);
    const options = {
      messageSchema: messagesSchemas[formProps.moduleCommand],
      txInitiatorAccount,
    };
    const [tx, error] = await signMultisigTransaction(
      activeWallet,
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
        type: actionTypes.transactionDoubleSigned,
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
 *
 * @param {object} data
 * @param {object} data.rawTransaction Transaction config required by Lisk Element
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
