import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { joinModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
import { getKeys } from '@wallet/utils/account';

const getNumbersOfSignaturesRequired = ({ keys, isRegisterMultisignature }) => {
  if (isRegisterMultisignature) {
    return keys.mandatoryKeys.length + keys.optionalKeys.length;
  }
  return keys.numberOfSignatures;
};

const getNonEmptySignatures = (transaction, isRegisterMultisignature) => {
  if (isRegisterMultisignature) {
    return transaction.params.signatures.filter(
      (signature) => signature !== null && signature.length
    );
  }
  return transaction.signatures.filter((signature) => signature !== null && signature.length);
};

export const findNonEmptySignatureIndices = (signatures) => {
  const indices = [];

  signatures.forEach((signature, index) => {
    if (signature === null || signature.length === 0) {
      indices.push(index);
    }
  });

  return indices;
};

// eslint-disable-next-line max-statements, complexity
export const getTransactionSignatureStatus = (senderAccount, transaction) => {
  const moduleCommand = joinModuleAndCommand(transaction);
  const isRegisterMultisignature =
    moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

  if (isRegisterMultisignature) {
    const {
      params: { mandatoryKeys, optionalKeys },
    } = transaction;
    const numberOfSignatures = mandatoryKeys.length + optionalKeys.length;
    const paramsSignature = transaction.params.signatures.filter(
      (s) => s.toString('hex') !== Buffer.alloc(64).toString('hex')
    );

    if (paramsSignature.length !== numberOfSignatures) {
      return signatureCollectionStatus.partiallySigned;
    }
    if (paramsSignature.length === numberOfSignatures && transaction.signatures.length > 0) {
      return signatureCollectionStatus.fullySigned;
    }
  }
  const keys = getKeys({
    senderAccount,
    transaction,
    isRegisterMultisignature,
  });

  const required = getNumbersOfSignaturesRequired({
    keys,
    transaction,
    isRegisterMultisignature,
  });
  const alreadySigned = getNonEmptySignatures(transaction, isRegisterMultisignature).length;
  const mandatorySigs = keys.mandatoryKeys?.length;
  const nonEmptyMandatorySigs = getNonEmptySignatures(transaction, isRegisterMultisignature).length;

  if (required > alreadySigned) {
    return signatureCollectionStatus.partiallySigned;
  }
  if (required === alreadySigned) {
    return signatureCollectionStatus.fullySigned;
  }
  if (required === alreadySigned && nonEmptyMandatorySigs < mandatorySigs) {
    return signatureCollectionStatus.occupiedByOptionals;
  }
  return signatureCollectionStatus.overSigned;
};

// eslint-disable-next-line max-statements
export const showSignButton = (senderAccount, account, transaction) => {
  const isRegisterMultisignature =
    joinModuleAndCommand(transaction) === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

  let mandatoryKeys = [];
  let optionalKeys = [];

  if (isRegisterMultisignature) {
    mandatoryKeys = transaction.params.mandatoryKeys;
    optionalKeys = transaction.params.optionalKeys;
  } else {
    mandatoryKeys = senderAccount.keys?.mandatoryKeys || [];
    optionalKeys = senderAccount.keys?.optionalKeys || [];
  }

  return (
    mandatoryKeys.includes(account.summary.publicKey) ||
    optionalKeys.includes(account.summary.publicKey)
  );
};
