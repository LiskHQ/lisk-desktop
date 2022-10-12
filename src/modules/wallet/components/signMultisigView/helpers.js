import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { joinModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
import { getKeys } from '@wallet/utils/account';

const getNumbersOfSignaturesRequired = ({ keys, isGroupRegistration }) => {
  if (isGroupRegistration) {
    // +1 to account for double sender signature
    return keys.mandatoryKeys.length + keys.optionalKeys.length + 1;
  }
  return keys.numberOfSignatures;
};

const getNonEmptySignatures = (signatures) =>
  signatures.filter(signature => signature !== null && signature.length);

export const findNonEmptySignatureIndices = (signatures) => {
  const indices = [];

  signatures.forEach((signature, index) => {
    if (signature === null || signature.length === 0) {
      indices.push(index);
    }
  });

  return indices;
};

// eslint-disable-next-line max-statements
export const getTransactionSignatureStatus = (senderAccount, transaction) => {
  const moduleCommand = transaction.moduleCommand || joinModuleAndCommand(transaction);
  const isGroupRegistration = moduleCommand
    === MODULE_COMMANDS_NAME_MAP.registerMultisignature;
  const keys = getKeys({
    senderAccount, transaction, isGroupRegistration,
  });

  const required = getNumbersOfSignaturesRequired({
    keys, transaction, isGroupRegistration,
  });

  const alreadySigned = getNonEmptySignatures(transaction.signatures).length;
  const registrationExtra = isGroupRegistration ? 1 : 0;
  const mandatorySigs = keys.mandatoryKeys.length + registrationExtra;
  const nonEmptyMandatorySigs = getNonEmptySignatures(
    transaction.signatures.slice(0, mandatorySigs),
  ).length;

  if (required > alreadySigned) {
    return signatureCollectionStatus.partiallySigned;
  }
  if (required === alreadySigned && nonEmptyMandatorySigs === mandatorySigs) {
    return signatureCollectionStatus.fullySigned;
  }
  if (required === alreadySigned && nonEmptyMandatorySigs < mandatorySigs) {
    return signatureCollectionStatus.occupiedByOptionals;
  }
  return signatureCollectionStatus.overSigned;
};

// eslint-disable-next-line max-statements
export const showSignButton = (senderAccount, account, transaction) => {
  const isGroupRegistration = transaction.moduleCommand
    === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

  let mandatoryKeys = [];
  let optionalKeys = [];

  if (isGroupRegistration) {
    mandatoryKeys = transaction.params.mandatoryKeys;
    optionalKeys = transaction.params.optionalKeys;
  } else {
    mandatoryKeys = senderAccount.keys.mandatoryKeys;
    optionalKeys = senderAccount.keys.optionalKeys;
  }

  return mandatoryKeys.includes(account.summary.publicKey)
    || optionalKeys.includes(account.summary.publicKey);
};
