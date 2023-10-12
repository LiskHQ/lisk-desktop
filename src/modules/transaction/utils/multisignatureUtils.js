import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { calculateRemainingAndSignedMembers } from '@wallet/utils/account';

function getRemainingTxParamMembers(transactionJSON, isRegisterMultisignature) {
  const transactionParamKeys = {
    optionalKeys: transactionJSON.params.optionalKeys || [],
    mandatoryKeys: transactionJSON.params.mandatoryKeys || [],
    numberOfSignatures: transactionJSON.params.numberOfSignatures || 0,
  };

  const { remaining: remainingTxParamMembers = [] } = isRegisterMultisignature
    ? calculateRemainingAndSignedMembers(transactionParamKeys, transactionJSON, true)
    : {};
  return remainingTxParamMembers;
}

function getRemainingRootMembers(transactionJSON, txInitiatorAccount) {
  const accountKeys = {
    optionalKeys: txInitiatorAccount?.keys?.optionalKeys || [],
    mandatoryKeys: txInitiatorAccount?.keys?.mandatoryKeys || [],
    numberOfSignatures: txInitiatorAccount?.keys?.numberOfSignatures || 0,
  };

  const { remaining: remainingRootMembers = [] } = calculateRemainingAndSignedMembers(
    accountKeys,
    transactionJSON,
    false
  );

  return remainingRootMembers;
}

function getRemainingMember(members, getAccountByPublicKey) {
  let remainingMember = null;
  members.find(({ publicKey }) => {
    const account = getAccountByPublicKey(publicKey);
    if (account) {
      remainingMember = account;
      return true;
    }

    return false;
  });

  return remainingMember;
}

// eslint-disable-next-line complexity,max-statements
export const getNextAccountToSign = ({
  getAccountByPublicKey,
  transactionJSON,
  txInitiatorAccount,
}) => {
  let nextAccountToSign = null;

  const isRegisterMultisignature =
    joinModuleAndCommand(transactionJSON) === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

  const isMultiSignatureAccount = txInitiatorAccount?.numberOfSignatures > 0;
  const isEditRegisterMultiSignature = isRegisterMultisignature && isMultiSignatureAccount;

  const remainingTxParamMembers = getRemainingTxParamMembers(
    transactionJSON,
    isRegisterMultisignature
  );
  const remainingRootMembers = getRemainingRootMembers(transactionJSON, txInitiatorAccount);

  const hasRemainingSignaturesForNonMultiSigAccount =
    isRegisterMultisignature && !isMultiSignatureAccount && remainingTxParamMembers.length > 0;

  const canInitiatorAccountSign =
    isRegisterMultisignature &&
    !isMultiSignatureAccount &&
    remainingTxParamMembers.length === 0 &&
    transactionJSON.signatures.length === 0;

  if (
    (isEditRegisterMultiSignature && remainingTxParamMembers.length > 0) ||
    hasRemainingSignaturesForNonMultiSigAccount
  ) {
    nextAccountToSign = getRemainingMember(remainingTxParamMembers, getAccountByPublicKey);
  } else if (remainingTxParamMembers.length === 0 && remainingRootMembers.length > 0) {
    nextAccountToSign = getRemainingMember(remainingRootMembers, getAccountByPublicKey);
  } else if (canInitiatorAccountSign) {
    nextAccountToSign = getAccountByPublicKey(txInitiatorAccount.summary.publicKey);
  }

  return nextAccountToSign;
};
