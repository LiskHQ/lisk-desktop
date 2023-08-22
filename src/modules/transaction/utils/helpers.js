import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { formatAmountBasedOnLocale } from 'src/utils/formattedNumber';

const getTxDirectionConfig = (moduleCommand, host, recipient, styles) => {
  if (
    moduleCommand === MODULE_COMMANDS_NAME_MAP.unlock ||
    moduleCommand === MODULE_COMMANDS_NAME_MAP.reclaimLSK
  ) {
    return {
      sign: '',
      style: styles.unlock,
    };
  }
  if (moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer && host === recipient) {
    return {
      sign: '',
      style: styles.receive,
    };
  }
  if (moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer) {
    return {
      sign: '- ',
      style: '',
    };
  }
  return false;
};

export const getFeeStatus = ({ fee, tokenSymbol, customFee }) => {
  if (customFee) {
    return `${formatAmountBasedOnLocale({ value: customFee.value })} ${tokenSymbol}`;
  }
  return !fee.error ? `${formatAmountBasedOnLocale({ value: fee })} ${tokenSymbol}` : fee.feedback;
};

export const getSpaceSeparated = (str) => str.replace(/([a-z])([A-Z]|[0-9]+)/g, '$1 $2');

export default getTxDirectionConfig;

export const trimBigintString = (data) => {
  const result = Array.isArray(data) ? [] : {};
  const objectKeys = Object.keys(data);

  objectKeys.forEach((key) => {
    const value = data[key];
    const isObject = typeof value === 'object' && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const intValue = parseInt(value, 10);
    const isBigIntString = typeof value === 'string' && (intValue || intValue === 0);

    result[key] = value;

    if (isObject || isArray) {
      result[key] = trimBigintString(value);
    } else if (isBigIntString) {
      result[key] = result[key].replace(/n$/, '');
    }
  });

  return result;
};

export const filterIncomingTransactions = (transactions, account) =>
  transactions.filter(
    (transaction) =>
      transaction &&
      transaction.moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer &&
      transaction.params.recipientAddress === account.metadata?.address
  );

export const dateRangeCompare = (filterDateRange, txDate) => {
  const [fromDate, toDate] = filterDateRange ? filterDateRange.split(':') : ['', ''];
  // TxDate valid when it's within the from date and to date if both exist
  if (fromDate && toDate) {
    return txDate > fromDate && txDate < toDate;
  }
  // TxDate valid when it's above the fromDate if fromDate exists
  if (fromDate) {
    return txDate > fromDate;
  }
  // TxDate valid when it's below the toDate if toDate exists
  if (toDate) {
    return txDate < toDate;
  }
  // TxDate valid when from date and to date both don't exist
  return true;
};
