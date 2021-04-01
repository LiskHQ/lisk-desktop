import { MODULE_ASSETS_NAME_ID_MAP, moduleAssetSchemas } from '@constants';
import { getSchemas } from './api/transaction';

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


const retrieveSchemas = async ({ serviceUrl }) => {
  const response = await getSchemas({ baseUrl: serviceUrl });
  response.data.forEach((data) => {
    moduleAssetSchemas[data.moduleAssetId] = data.schema;
  });
};

// eslint-disable-next-line import/prefer-default-export
export { retrieveSchemas, getModuleAssetSenderLabel, getModuleAssetTitle };
