import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import {
  formatAmountBasedOnLocale,
} from 'src/utils/formattedNumber';

const getTxDirectionConfig = (moduleCommandID, host, recipient, styles) => {
  if (moduleCommandID === MODULE_COMMANDS_NAME_ID_MAP.unlockToken
      || moduleCommandID === MODULE_COMMANDS_NAME_ID_MAP.reclaimLSK) {
    return {
      sign: '',
      style: styles.unlock,
    };
  }
  if (moduleCommandID === MODULE_COMMANDS_NAME_ID_MAP.transfer && host === recipient) {
    return {
      sign: '',
      style: styles.receive,
    };
  }
  if (moduleCommandID === MODULE_COMMANDS_NAME_ID_MAP.transfer) {
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

export const getSpaceSeparated = str => str.replace(/([A-Z])/g, ' $1');

export default getTxDirectionConfig;
