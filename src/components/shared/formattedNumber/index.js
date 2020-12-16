import React from 'react';
import numeral from 'numeral';
import 'numeral/locales';
import { withTranslation } from 'react-i18next';
import i18n from '../../../i18n';

const FormattedNumber = ({ val }) => {
  // set numeral language
  numeral.locale(i18n.language);
  const formattedVal = numeral(val).format('0,0.[0000000000000]');
  return <React.Fragment>{formattedVal}</React.Fragment>;
};

export default withTranslation()(FormattedNumber);
