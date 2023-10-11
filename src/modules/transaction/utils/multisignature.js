import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { calculateRemainingAndSignedMembers } from '@wallet/utils/account';

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

  const accountKeys = {
    optionalKeys: txInitiatorAccount?.keys?.optionalKeys || [],
    mandatoryKeys: txInitiatorAccount?.keys?.mandatoryKeys || [],
    numberOfSignatures: txInitiatorAccount?.keys?.numberOfSignatures || 0,
  };
  const transactionParamKeys = {
    optionalKeys: transactionJSON.params.optionalKeys || [],
    mandatoryKeys: transactionJSON.params.mandatoryKeys || [],
    numberOfSignatures: transactionJSON.params.numberOfSignatures || 0,
  };

  const { remaining: remainingTxParamMembers = [] } = isRegisterMultisignature
    ? calculateRemainingAndSignedMembers(transactionParamKeys, transactionJSON, true)
    : {};

  const { remaining: remainingRootMembers = [] } = calculateRemainingAndSignedMembers(
    accountKeys,
    transactionJSON,
    false
  );

  if (isEditRegisterMultiSignature && remainingTxParamMembers.length > 0) {
    remainingTxParamMembers.find(({ publicKey }) => {
      const account = getAccountByPublicKey(publicKey);
      if (account) {
        nextAccountToSign = account;
        return true;
      }

      return false;
    });
  } else if (remainingTxParamMembers.length === 0 && remainingRootMembers.length > 0) {
    remainingRootMembers.find(({ publicKey }) => {
      const account = getAccountByPublicKey(publicKey);
      if (account) {
        nextAccountToSign = account;
        return true;
      }

      return false;
    });
  }

  console.log('next member to sign:', {
    nextAccountToSign,
    isRegisterMultisignature,
    isMultiSignatureAccount,
    isEditRegisterMultiSignature,
    accountKeys,
    transactionParamKeys,
    txInitiatorAccount,
    remainingTxParamMembers,
    remainingRootMembers,
    transactionJSON,
  });

  return nextAccountToSign;
};
