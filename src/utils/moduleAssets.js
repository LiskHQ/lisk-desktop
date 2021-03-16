import { MODULE_ASSETS, ASSET_SCHEMA_MAP } from '@constants';

const getModuleAssetSenderLabel = (t = str => str) => ({
  [MODULE_ASSETS.transfer]: t('Sender'),
  [MODULE_ASSETS.reclaimLSK]: t('Sender'),
  [MODULE_ASSETS.unlockToken]: t('Sender'),
  [MODULE_ASSETS.voteDelegate]: t('Voter'),
  [MODULE_ASSETS.registerDelegate]: t('Account nickname'),
  [MODULE_ASSETS.registerMultisignatureGroup]: t('Registrant'),
});


const selectSchema = moduleAssetType => ASSET_SCHEMA_MAP[moduleAssetType];

// eslint-disable-next-line import/prefer-default-export
export { selectSchema, getModuleAssetSenderLabel };
