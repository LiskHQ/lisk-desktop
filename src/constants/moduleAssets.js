import {
  MultisignatureSchema, RegisterDelegateSchema, TransferSchema, UnlockTransactionSchema, VoteSchema,
} from './schemas';

const moduleAssets = {
  transfer: 'token:transfer',
  // reclaimLSK: 'legacyAccount:reclaimLSK',
  unlockToken: 'dpos:unlockToken',
  voteDelegate: 'dpos:voteDelegate',
  registerDelegate: 'dpos:registerDelegate',
  registerMultisignatureGroup: 'keys:registerMultisignatureGroup',
};

const MODULE_ASSETS = Object.freeze(moduleAssets);

const assetSchemaMap = {
  [MODULE_ASSETS.transfer]: TransferSchema,

  // @todo verify, is this a simple transfer transaction? and can we use the same max fee
  // [MODULE_ASSETS.reclaimLSK]: ReclaimSchema,

  // @todo verify, is this a simple transfer transaction? and can we use the same max fee
  [MODULE_ASSETS.unlockToken]: UnlockTransactionSchema,
  [MODULE_ASSETS.voteDelegate]: VoteSchema,
  [MODULE_ASSETS.registerDelegate]: RegisterDelegateSchema,
  [MODULE_ASSETS.registerMultisignatureGroup]: MultisignatureSchema,
};

const ASSET_SCHEMA_MAP = Object.freeze(assetSchemaMap);

const maxAssetFee = {
  [MODULE_ASSETS.transfer]: 1e7,

  // @todo verify, is this a simple transfer transaction? and can we use the same max fee
  // [MODULE_ASSETS.reclaimLSK]: 1e7,

  // @todo verify, is this a simple transfer transaction? and can we use the same max fee
  [MODULE_ASSETS.unlockToken]: 1e7,
  [MODULE_ASSETS.voteDelegate]: 1e8,
  [MODULE_ASSETS.registerDelegate]: 25e8,
  [MODULE_ASSETS.registerMultisignatureGroup]: 5e8,
};

const MAX_ASSET_FEE = Object.freeze(maxAssetFee);

export { MODULE_ASSETS, ASSET_SCHEMA_MAP, MAX_ASSET_FEE };
