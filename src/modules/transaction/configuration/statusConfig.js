/* eslint-disable complexity */
import { isEmpty } from 'src/utils/helpers';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { LEDGER_HW_IPC_CHANNELS } from '@libs/ledgerHardwareWallet/constants';
import { transactionToJSON, getNumberOfSignatures, joinModuleAndCommand } from '../utils';
import { MODULE_COMMANDS_NAME_MAP } from './moduleCommand';

export const statusMessages = (t) => ({
  [txStatusTypes.multisigSignaturePartialSuccess]: {
    title: t('Your signature was successful'),
    message: t('You can download or copy the transaction and share it with other members.'),
  },
  [txStatusTypes.multisigSignatureSuccess]: {
    title: t('The transaction is now fully signed'),
    message: t(
      'Now you can send it to the blockchain. You may also copy or download it, if you wish to send the transaction using another device later.'
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
    message: t('Your transaction is submitted to network, you can now track the status of this transaction in your wallet.'),
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
});

/**
 * Defines the Status of the broadcasted tx.
 *
 * @param {Object} account - active account info
 * @param {Object} transactions - Transactions Status from the redux store
 * @param {boolean?} isMultisignature - Is the sender account multisig
 * @returns {Object} The Status code and message
 */
// eslint-disable-next-line max-statements
export const getTransactionStatus = (account, transactions, isMultisignature, canSenderSignTx) => {
  // Signature errors
  if (transactions.txSignatureError) {
    const txSignatureErrorMsg = transactions.txSignatureError.message;
    const isHWError = new RegExp(Object.keys(LEDGER_HW_IPC_CHANNELS).join('|')).test(
      txSignatureErrorMsg
    );
    if (isHWError) {
      return {
        code: txStatusTypes.hwRejected,
        message: txSignatureErrorMsg,
      };
    }

    return {
      code: txStatusTypes.signatureError,
      message: transactionToJSON(transactions.txSignatureError),
    };
  }

  // signature success
  if (!isEmpty(transactions.signedTransaction)) {
    const numberOfSignatures = getNumberOfSignatures(account, transactions.signedTransaction);
    let nonEmptySignatures = transactions.signedTransaction.signatures.filter(
      (sig) => sig.length > 0
    ).length;
    const moduleCommand = joinModuleAndCommand(transactions.signedTransaction);

    if (moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature) {
      nonEmptySignatures = transactions.signedTransaction.params.signatures.filter(
        (sig) => sig.compare(Buffer.alloc(64)) > 0
      ).length;
    }

    if (
      nonEmptySignatures < numberOfSignatures ||
      (isMultisignature &&
        nonEmptySignatures === numberOfSignatures &&
        !canSenderSignTx &&
        moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature)
    ) {
      return { code: txStatusTypes.multisigSignaturePartialSuccess };
    }

    if (isMultisignature && (nonEmptySignatures === numberOfSignatures || canSenderSignTx)) {
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
