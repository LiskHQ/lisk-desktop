import React from 'react';
import { fromRawLsk } from '@utils/lsk';
import FormattedNumber from '../formattedNumber';

const trimReg = /([0-9,]+\.(([0]{0,2})[1-9]{1,2})?)|-?(0\.([0]+)?[1-9]{1,2})/g;
const IntegerReg = /\.([0-9]+)/g;

const trim = (value) => {
  const matched = value.match(trimReg);
  const normalizedVal = matched && matched[0] !== '0.'
    ? matched[0].replace(/\.$/, '')
    : value;

  return normalizedVal;
};

const getInt = value => value.replace(IntegerReg, '');

/**
 * Displays the LSK/BTC amount with Token sign next to the value
 *
 * @param {Object} params
 * @param {String} params.val Amount in Beddows
 * @param {Boolean} params.showRounded Round the number (decimal)
 * @param {Boolean} params.showInt Remove the floating points
 * @param {String} params.token An option of LSK and BTC
 */
const LiskAmount = ({
  val, showRounded, showInt, token,
}) => {
  if (val === undefined) return (<span />);
  let value = fromRawLsk(val);
  if (showInt) value = getInt(value);
  else if (showRounded) value = trim(value);
  return (
    <React.Fragment>
      <FormattedNumber val={value} />
      {token && ` ${token}`}
    </React.Fragment>
  );
};

LiskAmount.defaultProps = {
  token: '',
};

export default LiskAmount;
