import { to } from 'await-to-js';
import { DEFAULT_LIMIT } from 'src/utils/monitor';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { extractKeyPair } from '@wallet/utils/account';
import { getTransactionSignatureStatus } from '@wallet/components/signMultisigView/helpers';
import { selectActiveTokenAccount } from '@common/store';
import { timerReset } from '@auth/store/action';
import { loadingStarted, loadingFinished } from '@common/store/actions/loading';
import actionTypes from './actionTypes';
import { getTransactions, broadcast } from '../api';
import {
  signMultisigTransaction,
  elementTxToDesktopTx,
  desktopTxToElementsTx,
} from '../utils';

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
export const transactionDoubleSigned = () => async (dispatch, getState) => {
  const state = getState();
  const { transactions, network } = state;
  const keyPair = extractKeyPair({
    passphrase: state.wallet.secondPassphrase,
    enableCustomDerivationPath: false,
  });
  const activeWallet = selectActiveTokenAccount(state);
  activeWallet.summary.publicKey = keyPair.publicKey;
  activeWallet.summary.privateKey = keyPair.privateKey;

  const [signedTx, err] = await signMultisigTransaction(
    elementTxToDesktopTx(transactions.signedTransaction),
    activeWallet,
    {
      data: activeWallet, // SenderAccount is the same of the double-signer
    },
    signatureCollectionStatus.partiallySigned,
    network,
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
export const transactionBroadcasted = transaction =>
  // eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    const { network, token, wallet } = getState();
    const activeToken = token.active;
    const serviceUrl = network.networks[activeToken].serviceUrl;

    const [error] = await to(broadcast(
      { transaction, serviceUrl, network },
    ));

    if (error) {
      dispatch({
        type: actionTypes.broadcastedTransactionError,
        data: {
          error,
          transaction,
        },
      });
    } else {
      dispatch({
        type: actionTypes.broadcastedTransactionSuccess,
        data: transaction,
      });

      const transformedTransaction = elementTxToDesktopTx(transaction);

      if (transformedTransaction.sender.address === wallet.info.LSK.summary.address) {
        dispatch(pendingTransactionAdded({ ...transformedTransaction, isPending: true }));
      }

      dispatch(timerReset());
    }
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
  rawTx, sender,
}) => async (dispatch, getState) => {
  const state = getState();
  const activeWallet = selectActiveTokenAccount(state);
  const txStatus = getTransactionSignatureStatus(sender.data, rawTx);

  const [tx, error] = await signMultisigTransaction(
    rawTx,
    activeWallet,
    sender,
    txStatus,
    state.network,
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
export const signatureSkipped = ({ rawTx }) => {
  const binaryTx = desktopTxToElementsTx(rawTx, rawTx.moduleAssetId);

  return ({
    type: actionTypes.signatureSkipped,
    data: binaryTx,
  });
};
