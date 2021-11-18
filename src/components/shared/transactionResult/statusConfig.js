import { transactionToJSON } from '@utils/transaction';
import { isEmpty } from '@utils/helpers';

export const txStatusTypes = {
  multisigSignaturePartialSuccess: 'MULTISIG_SIGNATURE_PARTIAL_SUCCESS',
  multisigSignatureSuccess: 'MULTISIG_SIGNATURE_SUCCESS',
  signatureSuccess: 'SIGNATURE_SUCCESS',
  multisigBroadcastSuccess: 'MULTISIG_BROADCAST_SUCCESS',
  broadcastSuccess: 'BROADCAST_SUCCESS',
  signatureError: 'SIGNATURE_ERROR',
  broadcastError: 'BROADCAST_ERROR',
  hwRejected: 'HW_REJECTED',
};

export const statusMessages = t => ({
  [txStatusTypes.multisigSignaturePartialSuccess]: {
    title: t('Your signature was successful'),
    message: t('You can download or copy the transaction and share it with other members.'),
  },
  [txStatusTypes.multisigSignatureSuccess]: {
    title: t('Your signature was successful'),
    message: t('You can download or copy the transaction and share it with other members. You can send the transaction too.'),
  },
  [txStatusTypes.signatureSuccess]: {
    title: t('Submitting the transaction'),
    message: t('Your transaction is being submitted to the blockchain.'),
  },
  [txStatusTypes.multisigBroadcastSuccess]: {
    title: t('Transaction submitted'),
    message: t('Your transaction has been submitted and will appear in sender account\'s wallet after confirmation.'),
  },
  [txStatusTypes.broadcastSuccess]: {
    title: t('Transaction submitted'),
    message: t('Your transaction has been submitted and will be confirmed in a few moments.'),
  },
  [txStatusTypes.signatureError]: {
    title: t('Transaction failed'),
    message: t('Oops, it looks like something went wrong. Please try again.'),
  },
  [txStatusTypes.broadcastError]: {
    title: t('Transaction failed'),
    message: t('Oops, it looks like something went wrong. Please try again.'),
  },
  [txStatusTypes.hwRejected]: {
    title: t('Transaction aborted on device'),
    message: t('You have cancelled the transaction on your hardware wallet.'),
  },
});

/**
 * Defines the status of the broadcasted tx.
 *
 * @param {Object} transactions - Transactions status from the redux store
 * @returns {Object} The status code and message
 */
// eslint-disable-next-line max-statements
export const getTransactionStatus = (transactions) => {
  if (transactions.txSignatureError) {
    return {
      code: txStatusTypes.signatureError,
      message: transactionToJSON(transactions.txSignatureError),
    };
  }
  if (
    !isEmpty(transactions.signedTransaction)
    && transactions.signedTransaction.signatures.some(sig => sig.length === 0)
  ) {
    return { code: txStatusTypes.multisigSignaturePartialSuccess };
  }
  if (
    !isEmpty(transactions.signedTransaction)
    && transactions.signedTransaction.signatures.length > 1
    && !transactions.signedTransaction.signatures.some(sig => sig.length === 0)
  ) {
    return { code: txStatusTypes.multisigSignatureSuccess };
  }
  if (!isEmpty(transactions.signedTransaction)) {
    return { code: txStatusTypes.signatureSuccess };
  }
  if (transactions.txBroadcastError) {
    return {
      code: txStatusTypes.broadcastError,
      message: transactionToJSON(transactions.txBroadcastError),
    };
  }
  return { code: txStatusTypes.broadcastSuccess };
};
