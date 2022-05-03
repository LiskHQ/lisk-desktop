import { to } from 'await-to-js';
import { DEFAULT_LIMIT } from '@views/configuration';
import { tokenMap } from '@token/fungible/consts/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { isEmpty } from '@common/utilities/helpers';
import { extractKeyPair } from '@wallet/utilities/account';
import { getTransactionSignatureStatus } from '@screens/managers/signMultiSignTransaction/helpers';
import { timerReset } from '@wallet/store/action';
import { loadingStarted, loadingFinished } from '@common/store/actions/loading';
import actionTypes from './actionTypes';
import { getTransactions, create, broadcast } from '../api';
import {
  signMultisigTransaction,
  transformTransaction,
  createTransactionObject,
  flattenTransaction,
} from '../utils/transaction';

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

  const { network, settings } = getState();
  const token = settings.token.active;

  const params = {
    address,
    ...filters,
    limit,
    offset,
  };

  try {
    const { data, meta } = await getTransactions({ network, params }, token);
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
 * Calls transactionAPI.create for create the tx object that will broadcast
 * @param {Object} data
 * @param {String} data.recipientAddress
 * @param {Number} data.amount - In raw format (satoshi, beddows)
 * @param {Number} data.fee - In raw format, used for updating the TX List.
 * @param {Number} data.dynamicFeePerByte - In raw format, used for creating BTC transaction.
 * @param {Number} data.reference - Data field for LSK transactions
 */
// eslint-disable-next-line max-statements
export const transactionCreated = data => async (dispatch, getState) => {
  const {
    wallet, settings, network,
  } = getState();
  const activeToken = settings.token.active;
  const hwInfo = isEmpty(wallet.hwInfo) ? undefined : wallet.hwInfo; // @todo remove this by #3898

  const [error, tx] = await to(create({
    transactionObject: {
      ...data,
      moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
    },
    wallet: {
      ...wallet.info[activeToken],
      hwInfo,
      passphrase: wallet.passphrase,
    },
    network,
  }, activeToken));

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

/**
 * Signs the transaction using a given second passphrase
 *
 * @param {object} data
 * @param {string} data.secondPass
 */
export const transactionDoubleSigned = () => async (dispatch, getState) => {
  const {
    transactions, network, wallet, settings,
  } = getState();
  const keyPair = extractKeyPair({
    passphrase: wallet.secondPassphrase,
    enableCustomDerivationPath: false,
  });
  const activeWallet = {
    ...wallet.info[settings.token.active],
    passphrase: wallet.secondPassphrase,
    summary: {
      ...wallet.info[settings.token.active].summary,
      ...keyPair,
    },
  };
  const transformedTx = transformTransaction(transactions.signedTransaction);
  const [signedTx, err] = await signMultisigTransaction(
    transformedTx,
    activeWallet,
    {
      data: activeWallet,
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
 * @param {Number} transaction.dynamicFeePerByte - In raw format, used for creating BTC transaction.
 * @param {Number} transaction.reference - Data field for LSK transactions
 */
export const transactionBroadcasted = transaction =>
  // eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    const { network, settings, wallet } = getState();
    const activeToken = settings.token.active;
    const serviceUrl = network.networks[activeToken].serviceUrl;

    const [error] = await to(broadcast(
      { transaction, serviceUrl, network },
      activeToken,
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

      if (activeToken === tokenMap.LSK.key) {
        const transformedTransaction = transformTransaction(transaction);
        if (transformedTransaction.sender.address === wallet.info.LSK.summary.address) {
          dispatch(pendingTransactionAdded({ ...transformedTransaction, isPending: true }));
        }
      }

      dispatch(timerReset());
    }
  };

/**
 * Signs a given multisignature transaction using passphrase
 * and dispatches the relevant action.
 *
 * @param {object} data
 * @param {object} data.rawTransaction Transaction config required by Lisk Element
 * @param {object} data.sender
 * @param {object} data.sender.data - Sender account info in Lisk API schema
 */
export const multisigTransactionSigned = ({
  rawTransaction, sender,
}) => async (dispatch, getState) => {
  const {
    network, wallet,
  } = getState();
  const activeWallet = {
    ...wallet.info.LSK,
    passphrase: wallet.passphrase,
    hwInfo: wallet.hwInfo,
  };
  const txStatus = getTransactionSignatureStatus(sender.data, rawTransaction);

  const [tx, error] = await signMultisigTransaction(
    rawTransaction,
    activeWallet,
    sender,
    txStatus,
    network,
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
export const signatureSkipped = ({ rawTransaction }) => {
  const flatTx = flattenTransaction(rawTransaction);
  const binaryTx = createTransactionObject(flatTx, rawTransaction.moduleAssetId);

  return ({
    type: actionTypes.signatureSkipped,
    data: binaryTx,
  });
};
