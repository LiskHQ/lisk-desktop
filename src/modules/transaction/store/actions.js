import { DEFAULT_LIMIT } from 'src/utils/monitor';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { extractKeyPair } from '@wallet/utils/account';
import { getTransactionSignatureStatus } from '@wallet/components/signMultisigView/helpers';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { loadingStarted, loadingFinished } from 'src/modules/common/store/actions';
import actionTypes from './actionTypes';
import { getTransactions, broadcast, dryRun } from '../api';
import {
  joinModuleAndCommand,
  signMultisigTransaction,
} from '../utils';
import {
  fromTransactionJSON,
  toTransactionJSON,
} from '../utils/encoding';

/**
 * Action trigger when user logout from the application
 * the transactions reducer is set to initial state
 */
export const emptyTransactionsData = () => ({ type: actionTypes.emptyTransactionsData });

/**
 * Action trigger after a new transaction is broadcasted to the network
 * then the transaction is add to the pending transaction array in transaction reducer
 * Used in:  Send, Vote, and delegate registration.
 * @param {Object} params - all params
 * @param {String} params.senderPublicKey - alphanumeric string
 */
export const pendingTransactionAdded = data => ({
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
export const transactionsRetrieved = ({
  address,
  limit = DEFAULT_LIMIT,
  offset = 0,
  filters = {},
}) => async (dispatch, getState) => {
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
export const transactionDoubleSigned = () => async (dispatch, getState) => {
  const state = getState();
  const { transactions, network } = state;
  const keyPair = await extractKeyPair({
    passphrase: state.wallet.secondPassphrase,
    enableCustomDerivationPath: false,
  });
  const activeWallet = selectActiveTokenAccount(state);
  const schemas = network.networks.LSK.moduleCommandSchemas[transactions.moduleCommand];
  const transaction = toTransactionJSON(transactions.signedTransaction, schemas[transactions.moduleCommand]);
  const [signedTx, err] = await signMultisigTransaction(
    activeWallet,
    {
      data: activeWallet, // SenderAccount is the same of the double-signer
    },
    transaction,
    signatureCollectionStatus.partiallySigned,
    schemas[transactions.moduleCommand],
    network.networks.LSK.chainID,
    keyPair.privateKey,
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
export const transactionBroadcasted = (transaction, moduleCommandSchemas) =>
  // eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    const { network, token } = getState();
    const activeToken = token.active;
    const serviceUrl = network.networks[activeToken].serviceUrl;
    let broadcastResult;
    // @todo dry run before broadcast
    const dryRunResult =  await dryRun({ transaction, serviceUrl, network });

    if (dryRunResult.data?.success === true) {
      broadcastResult = await broadcast(
        { transaction, serviceUrl, moduleCommandSchemas },
      );

      if(!broadcastResult.data?.error) {
        const moduleCommand = joinModuleAndCommand(transaction);
        const paramsSchema = moduleCommandSchemas[moduleCommand];
        const transactionJSON = toTransactionJSON(transaction, paramsSchema);
        dispatch({
          type: actionTypes.broadcastedTransactionSuccess,
          data: transaction,
        });
        dispatch(pendingTransactionAdded({ ...transactionJSON, isPending: true }));

        return true;
      }
    }

    // @todo Remove the third fallback error message when the Core API errors are implemented
    dispatch({
      type: actionTypes.broadcastedTransactionError,
      data: {
        error: dryRunResult.data?.message ?? broadcastResult?.error ?? 'An error occurred while broadcasting the transaction',
        transaction,
      },
    });

    return false;
  };

/**
 * Signs a given multisignature transaction using passphrase
 * and dispatches the relevant action.
 *
 * @param {object} data
 * @param {object} data.rawTx Transaction config required by Lisk Element
 * @param {object} data.sender
 * @param {object} data.sender.data - Sender account info in Lisk API schema
 */
export const multisigTransactionSigned = ({
  formProps,
  transactionJSON,
  sender,
  privateKey,
  txInitiatorAccount,
  moduleCommandSchemas,
}) => async (dispatch, getState) => {
  const state = getState();
  const activeWallet = selectActiveTokenAccount(state);
  const txStatus = getTransactionSignatureStatus(sender, transactionJSON);

  const [tx, error] = await signMultisigTransaction(
    activeWallet,
    sender,
    transactionJSON,
    txStatus,
    moduleCommandSchemas[formProps.moduleCommand],
    state.network.networks.LSK.chainID,
    privateKey,
    txInitiatorAccount, // this is the intitor of the transaction wanting to be signed
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
export const signatureSkipped = ({ formProps, transactionJSON }) => (dispatch, getState) => {
  const { network } = getState();
  const schema = network.networks.LSK.moduleCommandSchemas[formProps.moduleCommand]
  const transactionObject = fromTransactionJSON(transactionJSON, schema);

  dispatch({
    type: actionTypes.signatureSkipped,
    data: transactionObject,
  });
};
