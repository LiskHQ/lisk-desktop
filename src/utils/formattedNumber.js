import numeral from 'numeral';
import 'numeral/locales';

export const formatAmountBasedOnLocale = ({
  value,
  locale = 'en',
  format = '0,0.[0000000000000000]',
}) => {
  numeral.locale(locale);
  return numeral(value).format(format);
};

export default {
  formatAmountBasedOnLocale,
};
