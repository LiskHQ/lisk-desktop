import { signatureCollectionStatus } from 'src/modules/transaction/configuration/txStatus';
import {
  getTransactionSignatureStatus,
  showSignButton,
} from '../components/signMultisigView/helpers';

/**
 * Get required statuses of a multi-signature transaction
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
