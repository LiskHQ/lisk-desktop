const modules = {
  token: 2,
  dpos: 5,
  multiSignature: 4,
};

const assets = {
  transfer: 0,
  registerDelegate: 0,
  voteDelegate: 1,
  unlockToken: 2,
  registerMultisignatureGroup: 0,
};

const moduleAssetNameIdMap = {
  transfer: `${modules.token}:${assets.transfer}`,
  unlockToken: `${modules.dpos}:${assets.unlockToken}`,
  voteDelegate: `${modules.dpos}:${assets.voteDelegate}`,
  registerDelegate: `${modules.dpos}:${assets.registerDelegate}`,
  registerMultisignatureGroup: `${modules.multiSignature}:${assets.registerMultisignatureGroup}`,
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

const moduleAssetSchemas = {};

const MODULE_ASSETS_NAME_ID_MAP = Object.freeze(moduleAssetNameIdMap);
const MODULE_ASSETS_MAP = Object.freeze(moduleAssetMap);
const BASE_FEES = [
  Object.freeze({
    moduleID: modules.dpos,
    assetID: assets.registerDelegate,
    baseFee: '1000000000',
  }),
];

export {
  BASE_FEES,
  MODULE_ASSETS_MAP,
  MODULE_ASSETS_NAME_ID_MAP,
  moduleAssetSchemas,
};
