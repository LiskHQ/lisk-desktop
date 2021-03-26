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
    setSchema: function setSchema(schema) { this.schema = schema; },
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleAssetNameIdMap.unlockToken]: {
    setSchema: function setSchema(schema) { this.schema = schema; },
    maxFee: 1e7,
    icon: 'unlockToken',
  },
  [moduleAssetNameIdMap.voteDelegate]: {
    setSchema: function setSchema(schema) { this.schema = schema; },
    maxFee: 1e8,
    icon: 'vote',
  },
  [moduleAssetNameIdMap.registerDelegate]: {
    setSchema: function setSchema(schema) { this.schema = schema; },
    maxFee: 25e8,
    icon: 'registerDelegate',
  },
  [moduleAssetNameIdMap.registerMultisignatureGroup]: {
    setSchema: function setSchema(schema) { this.schema = schema; },
    maxFee: 5e8,
    icon: 'registerMultisignatureGroup',
  },
};

const MODULE_ASSETS_NAME_ID_MAP = Object.freeze(moduleAssetNameIdMap);
const MODULE_ASSETS_MAP = Object.freeze(moduleAssetMap);

export { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP };
