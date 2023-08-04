import numeral from 'numeral';
import 'numeral/locales';
import i18n from 'src/utils/i18n/i18n';

export const formatAmountBasedOnLocale = ({ value, format = '0,0.[0000000000000000]' }) => {
  numeral.locale(i18n.language);
  const amount = parseFloat(value);
  return numeral(amount).format(format);
};
