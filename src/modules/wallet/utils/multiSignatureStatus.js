import { signatureCollectionStatus } from 'src/modules/transaction/configuration/txStatus';
import {
  getTransactionSignatureStatus,
  showSignButton,
} from '../components/signMultisigView/helpers';

/**
 * Get required statuses of a multi-signature transction
 *
 * @param {Object} data - The object containing, senderAccount, account, transactionJSON and currentAccount
 * @param {Object} data.senderAccount - sender's account
 * @param {Object} data.currentAccount - the currently selected encrypted account
 * @param {Object} daqta.transactionJSON - JSON formate of the transaction to be signed
 * @param {Object} daqta.account - user's account from redux
 * @returns {Object} padded string
 */
export const getMultiSignatureStatus = ({
  senderAccount,
  account,
  transactionJSON,
  currentAccount,
}) => {
  const isMember = showSignButton(senderAccount, account, transactionJSON);
  const signatureStatus = getTransactionSignatureStatus(senderAccount, transactionJSON);
  const canSenderSignTx =
    transactionJSON.senderPublicKey === currentAccount.metadata.pubkey &&
    signatureStatus === signatureCollectionStatus.fullySigned;

  return { isMember, signatureStatus, canSenderSignTx };
};
