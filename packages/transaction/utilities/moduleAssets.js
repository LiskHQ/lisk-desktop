import { MODULE_ASSETS_NAME_ID_MAP } from '@common/configuration';

const getModuleAssetSenderLabel = (t = str => str) => ({
  [MODULE_ASSETS_NAME_ID_MAP.transfer]: t('Sender'),
  [MODULE_ASSETS_NAME_ID_MAP.reclaimLSK]: t('Sender'),
  [MODULE_ASSETS_NAME_ID_MAP.unlockToken]: t('Sender'),
  [MODULE_ASSETS_NAME_ID_MAP.voteDelegate]: t('Voter'),
  [MODULE_ASSETS_NAME_ID_MAP.registerDelegate]: t('Account username'),
  [MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup]: t('Registrant'),
  [MODULE_ASSETS_NAME_ID_MAP.reportDelegateMisbehavior]: t('Reporter'),
});

const getModuleAssetTitle = (t = str => str) => ({
  [MODULE_ASSETS_NAME_ID_MAP.transfer]: t('Send'),
  [MODULE_ASSETS_NAME_ID_MAP.reclaimLSK]: t('Reclaim'),
  [MODULE_ASSETS_NAME_ID_MAP.unlockToken]: t('Unlock'),
  [MODULE_ASSETS_NAME_ID_MAP.voteDelegate]: t('Vote'),
  [MODULE_ASSETS_NAME_ID_MAP.registerDelegate]: t('Register delegate'),
  [MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup]: t('Register multisignature group'),
  [MODULE_ASSETS_NAME_ID_MAP.reportDelegateMisbehavior]: t('Report delegate misbehaviour'),
});

const splitModuleAndAssetIds = (moduleAssetId) => {
  const [moduleID, assetID] = moduleAssetId.split(':');
  return [Number(moduleID), Number(assetID)];
};

const joinModuleAndAssetIds = ({ moduleID, assetID }) => [moduleID, assetID].join(':');

export {
  getModuleAssetTitle,
  joinModuleAndAssetIds,
  splitModuleAndAssetIds,
  getModuleAssetSenderLabel,
};
