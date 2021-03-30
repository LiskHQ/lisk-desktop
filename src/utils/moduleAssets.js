import { MODULE_ASSETS_NAME_ID_MAP, moduleAssetSchema } from '@constants';
import { getSchema } from './api/transaction';

const getModuleAssetSenderLabel = (t = str => str) => ({
  [MODULE_ASSETS_NAME_ID_MAP.transfer]: t('Sender'),
  [MODULE_ASSETS_NAME_ID_MAP.reclaimLSK]: t('Sender'),
  [MODULE_ASSETS_NAME_ID_MAP.unlockToken]: t('Sender'),
  [MODULE_ASSETS_NAME_ID_MAP.voteDelegate]: t('Voter'),
  [MODULE_ASSETS_NAME_ID_MAP.registerDelegate]: t('Account nickname'),
  [MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup]: t('Registrant'),
});

const getModuleAssetTitle = (t = str => str) => ({
  [MODULE_ASSETS_NAME_ID_MAP.transfer]: t('Send'),
  [MODULE_ASSETS_NAME_ID_MAP.reclaimLSK]: t('Reclaim'),
  [MODULE_ASSETS_NAME_ID_MAP.unlockToken]: t('Unlock'),
  [MODULE_ASSETS_NAME_ID_MAP.voteDelegate]: t('Vote'),
  [MODULE_ASSETS_NAME_ID_MAP.registerDelegate]: t('Register Delegate'),
  [MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup]: t('Register Multisignature Group'),
});


const retrieveSchemas = (network) => {
  Object.values(MODULE_ASSETS_NAME_ID_MAP).forEach(async (moduleAssetId) => {
    const response = await getSchema({ params: { moduleAssetId }, network });
    moduleAssetSchema[moduleAssetId] = response.data[0]?.schema;
  });
};

// eslint-disable-next-line import/prefer-default-export
export { retrieveSchemas, getModuleAssetSenderLabel, getModuleAssetTitle };
