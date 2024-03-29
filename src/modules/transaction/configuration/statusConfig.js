/* eslint-disable complexity */
import { transactions as LiskTransaction } from '@liskhq/lisk-client';
import { isEmpty } from 'src/utils/helpers';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { calculateRemainingAndSignedMembers } from '@wallet/utils/account';
import { getNumberOfSignatures, joinModuleAndCommand, toTransactionJSON } from '../utils';
import { MODULE_COMMANDS_NAME_MAP } from './moduleCommand';

export const statusMessages = (t) => ({
  [txStatusTypes.multisigSignaturePartialSuccess]: {
    title: t('The transaction is partially signed'),
    message: t(
      'Your signature has been successfully included in the transaction. Kindly copy or download the partially signed transaction and share it with the remaining members to collect all required signatures before broadcasting.'
    ),
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
  [txStatusTypes.hwMemorySizeLimitRejection]: {
    title: t('Transaction rejected'),
    message: t(
      'Your ledger device cannot process this transaction due to device size limitation. Please connect a ledger device with a larger memory size or add your account to Lisk Desktop to complete this transaction.'
    ),
  },
  [txStatusTypes.hwCannotOpenPath]: {
    title: t('Account could not be found on device'),
    message: t('Please re-import your account.'),
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

const getErrorMessage = (transaction, paramSchema, errorMessage) => {
  let transactionJSON;
  try {
    LiskTransaction.validateTransaction(transaction, paramSchema);

    transactionJSON = toTransactionJSON(transaction, paramSchema);
  } catch (error) {
    return JSON.stringify({
      transaction,
      error: errorMessage,
    });
  }

  return {
    transaction: transactionJSON,
    error: errorMessage,
  };
};

function getHasRemainingMandatorySignatures(signedTransaction, walletKeys) {
  const transactionSignaturesAsStrings = signedTransaction.signatures.map((signature) =>
    signature.toString('hex')
  );

  const moduleCommand = joinModuleAndCommand(signedTransaction);
  const isMultisignatureRegistration =
    moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

  const { remaining } = calculateRemainingAndSignedMembers(
    walletKeys,
    { ...signedTransaction, signatures: transactionSignaturesAsStrings },
    isMultisignatureRegistration
  );

  return remaining.some(({ mandatory }) => mandatory);
}

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
  if (transactions.txSignatureError || transactions.signedTransaction?.errors) {
    const txSignatureErrorMsg = transactions.txSignatureError?.message;
    const hwTxStatusType = transactions.txSignatureError?.hwTxStatusType;
    if (hwTxStatusType) {
      return {
        code: hwTxStatusType,
        message: txSignatureErrorMsg,
      };
    }

    const message =
      transactions.signedTransaction?.message ||
      getErrorMessage(transactions.txSignatureError.transaction, paramSchema, txSignatureErrorMsg);

    return {
      code: txStatusTypes.signatureError,
      message,
    };
  }

  // broadcast error
  if (transactions.txBroadcastError) {
    return {
      code: txStatusTypes.broadcastError,
      message: getErrorMessage(
        transactions.txBroadcastError.transaction,
        transactions.txBroadcastError.paramsSchema || paramSchema,
        transactions.txBroadcastError.error
      ),
    };
  }

  // signature success
  if (!isEmpty(transactions.signedTransaction)) {
    const numberOfSignatures = getNumberOfSignatures(account, transactions.signedTransaction);
    const isRegisterMultisignature =
      moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature;
    const isMultisignature = account?.summary?.isMultisignature || options.isMultisignature;
    const isInitiatorAccountMultiSig = account?.numberOfSignatures > 0;

    const keys = isRegisterMultisignature
      ? {
          optionalKeys: transactions.signedTransaction.params.optionalKeys,
          mandatoryKeys: transactions.signedTransaction.params.mandatoryKeys,
          numberOfSignatures: transactions.signedTransaction.params.numberOfSignatures,
        }
      : account?.keys;

    const hasRemainingMandatorySignatures = getHasRemainingMandatorySignatures(
      transactions.signedTransaction,
      keys
    );

    let nonEmptySignatures = transactions.signedTransaction.signatures.filter(
      (sig) => sig.length > 0
    ).length;

    if (isRegisterMultisignature && !isInitiatorAccountMultiSig) {
      nonEmptySignatures = transactions.signedTransaction.params.signatures.filter(
        (sig) => sig.compare(Buffer.alloc(64)) > 0
      ).length;
    }

    if (
      hasRemainingMandatorySignatures ||
      nonEmptySignatures < numberOfSignatures ||
      (isMultisignature &&
        nonEmptySignatures === numberOfSignatures &&
        !options.canSenderSignTx &&
        isRegisterMultisignature &&
        !isInitiatorAccountMultiSig)
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

export const isTxStatusError = (statusCode) =>
  [txStatusTypes.signatureError, txStatusTypes.broadcastError].includes(statusCode);
