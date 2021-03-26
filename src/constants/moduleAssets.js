/* eslint-disable import/prefer-default-export */
import {
  MultisignatureSchema, RegisterDelegateSchema, TransferSchema, UnlockTransactionSchema, VoteSchema,
} from './schemas';

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
    schema: TransferSchema,
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleAssetNameIdMap.unlockToken]: {
    schema: UnlockTransactionSchema,
    maxFee: 1e7,
    icon: 'unlockToken',
  },
  [moduleAssetNameIdMap.voteDelegate]: {
    schema: VoteSchema,
    maxFee: 1e8,
    icon: 'vote',
  },
  [moduleAssetNameIdMap.registerDelegate]: {
    schema: RegisterDelegateSchema,
    maxFee: 25e8,
    icon: 'registerDelegate',
  },
  [moduleAssetNameIdMap.registerMultisignatureGroup]: {
    schema: MultisignatureSchema,
    maxFee: 5e8,
    icon: 'registerMultisignatureGroup',
  },
};

const MODULE_ASSETS_NAME_ID_MAP = Object.freeze(moduleAssetNameIdMap);
const MODULE_ASSETS_MAP = Object.freeze(moduleAssetMap);

export { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP };
