import React from 'react';
import numeral from 'numeral';
import * as locales from 'numeral/locales'; // eslint-disable-line
import { translate } from 'react-i18next';
import i18n from '../../i18n';

const FormattedNumber = ({ val }) => {
  // set numeral language
  numeral.locale(i18n.language);
  const formatedNumber = numeral(val).format('0,0.[0000000000000]');
  return <span>{formatedNumber}</span>;
};

export default translate()(FormattedNumber);
