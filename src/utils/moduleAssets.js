import { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP } from '@constants';
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


const selectSchema = moduleAssetId => new Promise(async (resolve, reject) => {
  const schema = MODULE_ASSETS_MAP[moduleAssetId].getSchema();
  if (schema) resolve(schema);

  try {
    const response = await getSchema({ moduleAssetId });
    MODULE_ASSETS_NAME_ID_MAP[moduleAssetId].setSchema(response.data[0]);
    resolve(response.data[0]);
  } catch (error) {
    reject(error);
  }
});

// eslint-disable-next-line import/prefer-default-export
export { selectSchema, getModuleAssetSenderLabel, getModuleAssetTitle };
