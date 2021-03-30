const moduleAssetNameIdMap = {
  transfer: '2:0',
  // reclaimLSK: 'legacyAccount:reclaimLSK',
  unlockToken: '5:2',
  voteDelegate: '5:1',
  registerDelegate: '5:0',
  registerMultisignatureGroup: '4:0',
};

const moduleAssetMap = {
  [moduleAssetNameIdMap.transfer]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleAssetNameIdMap.unlockToken]: {
    maxFee: 1e7,
    icon: 'unlockToken',
  },
  [moduleAssetNameIdMap.voteDelegate]: {
    maxFee: 1e8,
    icon: 'vote',
  },
  [moduleAssetNameIdMap.registerDelegate]: {
    maxFee: 25e8,
    icon: 'registerDelegate',
  },
  [moduleAssetNameIdMap.registerMultisignatureGroup]: {
    maxFee: 5e8,
    icon: 'registerMultisignatureGroup',
  },
};

const moduleAssetSchema = {
  [moduleAssetNameIdMap.transfer]: undefined,
  [moduleAssetNameIdMap.unlockToken]: undefined,
  [moduleAssetNameIdMap.voteDelegate]: undefined,
  [moduleAssetNameIdMap.registerDelegate]: undefined,
  [moduleAssetNameIdMap.registerMultisignatureGroup]: undefined,
};

const MODULE_ASSETS_NAME_ID_MAP = Object.freeze(moduleAssetNameIdMap);
const MODULE_ASSETS_MAP = Object.freeze(moduleAssetMap);

export { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP, moduleAssetSchema };
