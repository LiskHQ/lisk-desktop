import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { joinModuleAndAssetIds } from '@utils/moduleAssets';

const getNumbersOfSignaturesRequired = ({ keys, isGroupRegistration }) => {
  if (isGroupRegistration) {
    // +1 to account for double sender signature
    return keys.mandatoryKeys.length + keys.optionalKeys.length + 1;
  }
  return keys.numberOfSignatures;
};

export const getKeys = ({ senderAccount, transaction, isGroupRegistration }) => {
  if (isGroupRegistration) {
    return transaction.asset;
  }

  return senderAccount.keys;
};

const getNonEmptySignatures = (signatures) =>
  signatures.filter(signature => signature !== null && signature.length);

// eslint-disable-next-line max-statements
export const showSendButton = (senderAccount, transaction) => {
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

  return (required === alreadySigned);
};

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
