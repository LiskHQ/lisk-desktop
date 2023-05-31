/* eslint-disable complexity */
import { transactions as LiskTransaction } from '@liskhq/lisk-client';
import { isEmpty } from 'src/utils/helpers';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { getNumberOfSignatures, joinModuleAndCommand, toTransactionJSON } from '../utils';
import { MODULE_COMMANDS_NAME_MAP } from './moduleCommand';

export const statusMessages = (t) => ({
  [txStatusTypes.multisigSignaturePartialSuccess]: {
    title: t('Your signature was successful'),
    message: t('You can download or copy the transaction and share it with other members.'),
  },
  [txStatusTypes.multisigSignatureSuccess]: {
    title: t('The transaction is now fully signed'),
    message: t(
      'Now you can send it to the network. You may also copy or download it, if you wish to send the transaction using another device later.'
    ),
  },
  [txStatusTypes.signatureSuccess]: {
    title: t('Submitting the transaction'),
    message: t('Your transaction is signed successfully.'),
  },
  [txStatusTypes.multisigBroadcastSuccess]: {
    title: t('Transaction submitted'),
    message: t(
      "Your transaction has been submitted and will appear in sender account's wallet after confirmation."
    ),
  },
  [txStatusTypes.broadcastSuccess]: {
    title: t('Transaction submitted'),
    message: t(
      'Your transaction is submitted to network, you can now track the status of this transaction in your wallet.'
    ),
  },
  [txStatusTypes.signatureError]: {
    title: t('Transaction failed'),
    message: t('An error occurred while signing your transaction. Please try again.'),
  },
  [txStatusTypes.broadcastError]: {
    title: t('Transaction failed'),
    message: t(
      'An error occurred while sending your transaction to the network. Please try again.'
    ),
  },
  [txStatusTypes.hwRejected]: {
    title: t('Transaction aborted on device'),
    message: t('You have cancelled the transaction on your hardware wallet.'),
  },
  [txStatusTypes.hwDisconnected]: {
    title: t('Device disconnected'),
    message: t('You have disconnected the device'),
  },
  [txStatusTypes.hwLiskAppClosed]: {
    title: t('The Lisk application is closed'),
    message: t('The lisk app needs to be open to perform transactions from the ledger'),
  },
});

const getErrorMessage = (data, paramSchema) => {
  try {
    LiskTransaction.validateTransaction(data, paramSchema);

    return toTransactionJSON(data, paramSchema);
  } catch (error) {
    return data;
  }
};

/**
 * Defines the Status of the broadcasted tx.
 */
// eslint-disable-next-line max-statements
export const getTransactionStatus = (account, transactions, options = {}) => {
  const moduleCommand = joinModuleAndCommand(
    transactions.signedTransaction || transactions.txSignatureError || transactions.txBroadcastError
  );
  const paramSchema = options?.moduleCommandSchemas[moduleCommand];

  // Signature errors
  if (transactions.txSignatureError) {
    const txSignatureErrorMsg = transactions.txSignatureError.message;
    const hwTxStatusType = transactions.txSignatureError?.hwTxStatusType;
    if (hwTxStatusType) {
      return {
        code: hwTxStatusType,
        message: txSignatureErrorMsg,
      };
    }

    return {
      code: txStatusTypes.signatureError,
      message: JSON.stringify(getErrorMessage(transactions.txSignatureError, paramSchema)),
    };
  }

  // broadcast error
  if (transactions.txBroadcastError) {
    return {
      code: txStatusTypes.broadcastError,
      message: JSON.stringify(getErrorMessage(transactions.txBroadcastError, paramSchema)),
    };
  }

  // signature success
  if (!isEmpty(transactions.signedTransaction)) {
    const numberOfSignatures = getNumberOfSignatures(account, transactions.signedTransaction);
    let nonEmptySignatures = transactions.signedTransaction.signatures.filter(
      (sig) => sig.length > 0
    ).length;

    if (moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature) {
      nonEmptySignatures = transactions.signedTransaction.params.signatures.filter(
        (sig) => sig.compare(Buffer.alloc(64)) > 0
      ).length;
    }

    const isMultisignature = account?.summary?.isMultisignature || options.isMultisignature;

    if (
      nonEmptySignatures < numberOfSignatures ||
      (isMultisignature &&
        nonEmptySignatures === numberOfSignatures &&
        !options.canSenderSignTx &&
        moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature)
    ) {
      return { code: txStatusTypes.multisigSignaturePartialSuccess };
    }

    if (
      isMultisignature &&
      (nonEmptySignatures === numberOfSignatures || options.canSenderSignTx)
    ) {
      return { code: txStatusTypes.multisigSignatureSuccess };
    }

    return { code: txStatusTypes.signatureSuccess };
  }

  // broadcast success
  return { code: txStatusTypes.broadcastSuccess };
};

export const isTxStatusError = (statusCode) => [txStatusTypes.signatureError, txStatusTypes.broadcastError].includes(statusCode);
