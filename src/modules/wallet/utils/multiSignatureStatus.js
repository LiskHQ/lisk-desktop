import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { joinModuleAndCommand, toTransactionJSON } from '@transaction/utils';
import { isEmpty } from 'src/utils/helpers';
import {
  getTransactionSignatureStatus,
  showSignButton,
} from '../components/signMultisigView/helpers';
import { calculateRemainingAndSignedMembers } from './account';

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

  // eslint-disable-next-line max-statements
  const canCurrentMemberSign = () => {
    const isRegisterMultisignature =
      joinModuleAndCommand(transactionJSON) === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

    const isInitatorAccountMultiSig = senderAccount.numberOfSignatures > 1;

    const transactionKeys = {
      optionalKeys: transactionJSON.params.optionalKeys,
      mandatoryKeys: transactionJSON.params.mandatoryKeys,
      numberOfSignatures: transactionJSON.params.numberOfSignatures,
    };

    if (isRegisterMultisignature && isInitatorAccountMultiSig) {
      // TODO: This could lead to bug, as keys should be passed based on register/update multisignature logic over using multisig account to sign the transaction
      const { remaining: paramsTxSignaturesRemaining } = calculateRemainingAndSignedMembers(
        transactionKeys,
        transactionJSON,
        true
      );

      if (paramsTxSignaturesRemaining.length === 0) return isMember;

      const { optionalKeys, mandatoryKeys } = transactionJSON.params;
      return [...optionalKeys, ...mandatoryKeys].includes(account.summary.publicKey);
    }

    return isMember;
  };

  return {
    isMember,
    signatureStatus,
    canSenderSignTx,
    canCurrentMemberSign: canCurrentMemberSign(),
  };
};
