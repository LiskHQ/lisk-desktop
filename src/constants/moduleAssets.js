const moduleAssets = {
  transfer: 'token:transfer',
  reclaimLSK: 'legacyAccount:reclaimLSK',
  unlockToken: 'dpos:unlockToken',
  voteDelegate: 'dpos:voteDelegate',
  registerDelegate: 'dpos:registerDelegate',
  registerMultisignatureGroup: 'keys:registerMultisignatureGroup',
};

const MODULE_ASSETS = Object.freeze(moduleAssets);

const maxAssetFee = {
  [MODULE_ASSETS.trasfer]: 1e7,

  // @todo verify, is this a simple transfer transaction? and can we use the same max fee
  [MODULE_ASSETS.reclaimLSK]: 1e7,

  // @todo verify, is this a simple transfer transaction? and can we use the same max fee
  [MODULE_ASSETS.unlockToken]: 1e7,
  [MODULE_ASSETS.voteDelegate]: 1e8,
  [MODULE_ASSETS.registerDelegate]: 25e8,
  [MODULE_ASSETS.registerMultisignatureGroup]: 5e8,
};

export { MODULE_ASSETS, maxAssetFee };
