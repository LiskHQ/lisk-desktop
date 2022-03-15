import { transactionToJSON, getNumberOfSignatures } from '@utils/transaction';
import { isEmpty } from '@utils/helpers';
import { txStatusTypes } from '@constants';

export const statusMessages = t => ({
  [txStatusTypes.multisigSignaturePartialSuccess]: {
    title: t('Your signature was successful'),
    message: t('You can download or copy the transaction and share it with other members.'),
  },
  [txStatusTypes.multisigSignatureSuccess]: {
    title: t('The transaction is now fully signed'),
    message: t('Now you can send it to the blockchain. You may also copy or download it, if you wish to send the transaction using another device later.'),
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
    message: t('An error occurred while signing your transaction. Please try again.'),
  },
  [txStatusTypes.broadcastError]: {
    title: t('Transaction failed'),
    message: t('An error occurred while sending your transaction to the network. Please try again.'),
  },
  [txStatusTypes.hwRejected]: {
    title: t('Transaction aborted on device'),
    message: t('You have cancelled the transaction on your hardware wallet.'),
  },
});

/**
 * Defines the status of the broadcasted tx.
 *
 * @param {Object} account - active account info
 * @param {Object} transactions - Transactions status from the redux store
 * @param {boolean?} isMultisignature - Is the sender account multisig
 * @returns {Object} The status code and message
 */
// eslint-disable-next-line max-statements
export const getTransactionStatus = (account, transactions, isMultisignature) => {
  // Signature errors
  if (transactions.txSignatureError) {
    if (transactions.txSignatureError.message.indexOf('hwCommand') > -1) {
      return {
        code: txStatusTypes.hwRejected,
        message: transactions.txSignatureError.message,
      };
    }

    return {
      code: txStatusTypes.signatureError,
      message: transactionToJSON(transactions.txSignatureError),
    };
  }

  // signature success
  if (!isEmpty(transactions.signedTransaction)) {
    const transaction = {
      ...transactions.signedTransaction.asset,
      moduleAssetId: `${transactions.signedTransaction.moduleID}:${transactions.signedTransaction.assetID}`,
    };
    const requiredSignatures = getNumberOfSignatures(account, transaction);
    const nonEmptySignatures = transactions
      .signedTransaction.signatures.filter(sig => sig.length > 0).length;
    if (nonEmptySignatures < requiredSignatures) {
      return { code: txStatusTypes.multisigSignaturePartialSuccess };
    }

    if (isMultisignature && nonEmptySignatures === requiredSignatures) {
      return { code: txStatusTypes.multisigSignatureSuccess };
    }

    return { code: txStatusTypes.signatureSuccess };
  }

  // broadcast error
  if (transactions.txBroadcastError) {
    return {
      code: txStatusTypes.broadcastError,
      message: transactionToJSON(transactions.txBroadcastError),
    };
  }

  // broadcast success
  return { code: txStatusTypes.broadcastSuccess };
};
