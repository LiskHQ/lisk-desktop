import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';

export const getTxDirectionConfig = (moduleAssetId, host, recipient) => {
    if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.unlockToken
      || moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.reclaimLSK) {
      return {
        sign: '',
        style: styles.unlock,
      };
    }
    if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer && host === recipient) {
      return {
        sign: '',
        style: styles.receive,
      };
    }
    if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer) {
      return {
        sign: '- ',
        style: '',
      };
    }
    return false;
};