import { MODULE_ASSETS_NAME_ID_MAP, signatureCollectionStatus } from '@constants';
import { joinModuleAndAssetIds } from '@utils/moduleAssets';
import { getKeys } from '@utils/account';

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
  const moduleAssetId = transaction.moduleAssetId || joinModuleAndAssetIds(transaction);
  const isGroupRegistration = moduleAssetId
    === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;
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
  const isGroupRegistration = transaction.moduleAssetId
    === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

  let mandatoryKeys = [];
  let optionalKeys = [];

  if (isGroupRegistration) {
    mandatoryKeys = transaction.asset.mandatoryKeys;
    optionalKeys = transaction.asset.optionalKeys;
  } else {
    mandatoryKeys = senderAccount.keys.mandatoryKeys;
    optionalKeys = senderAccount.keys.optionalKeys;
  }

  return mandatoryKeys.includes(account.summary.publicKey)
    || optionalKeys.includes(account.summary.publicKey);
};
