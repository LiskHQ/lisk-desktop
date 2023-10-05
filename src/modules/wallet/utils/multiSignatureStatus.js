import { signatureCollectionStatus } from 'src/modules/transaction/configuration/txStatus';
import { joinModuleAndCommand, toTransactionJSON } from 'src/modules/transaction/utils';
import { isEmpty } from 'src/utils/helpers';
import {
  getTransactionSignatureStatus,
  showSignButton,
} from '../components/signMultisigView/helpers';

/**
 * Get required statuses for a given multi-signature transaction
 */
// eslint-disable-next-line max-statements
export const getMultiSignatureStatus = ({
  senderAccount,
  account,
  currentAccount,
  moduleCommandSchemas,
  transactions,
  ...rest
}) => {
  let transactionJSON = rest.transactionJSON;

  if (!isEmpty(transactions?.signedTransaction) && moduleCommandSchemas) {
    const moduleCommand = joinModuleAndCommand(rest.transactionJSON);
    const paramSchema = moduleCommandSchemas[moduleCommand];
    transactionJSON = toTransactionJSON(transactions.signedTransaction, paramSchema);
  }

  const isMember = showSignButton(senderAccount, account, transactionJSON);
  const signatureStatus = getTransactionSignatureStatus(senderAccount, transactionJSON);

  const canSenderSignTx =
    transactionJSON.senderPublicKey === currentAccount.metadata.pubkey &&
    signatureStatus === signatureCollectionStatus.fullySigned;

  return { isMember, signatureStatus, canSenderSignTx };
};
