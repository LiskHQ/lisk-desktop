import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import {
  formatAmountBasedOnLocale,
} from 'src/utils/formattedNumber';

const getTxDirectionConfig = (moduleAssetId, host, recipient, styles) => {
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

export const getFeeStatus = ({ fee, token, customFee }) => {
  if (customFee) {
    return customFee;
  }
  return !fee.error
    ? `${formatAmountBasedOnLocale({ value: fee.value })} ${token}`
    : fee.feedback;
};

export default getTxDirectionConfig;
