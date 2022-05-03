import React from 'react';
import { fromRawLsk } from '@token/utilities/lsk';
import FormattedNumber from 'src/utils/formattedNumber';

const trimReg = /([0-9,]+\.(([0]{0,2})[1-9]{1,2})?)|-?(0\.([0]+)?[1-9]{1,2})/g;
const IntegerReg = /\.([0-9]+)/g;

const trim = (value) => {
  const matched = value.match(trimReg);
  const isMatched = matched && matched[0] !== '0.';
  return isMatched ? matched[0].replace(/\.$/, '')
    : value;
};

const getInt = value => value.replace(IntegerReg, '');

/**
 * Displays the LSK/BTC amount with Token sign next to the value
 *
 * @param {Object} params
 * @param {Boolean?} params.convert Should convert the value to Beddows/Satoshi. Default true.
 * @param {String} params.val Amount in Beddows/Satoshi or LSK/BTC
 * @param {Boolean} params.showRounded Round the number (decimal)
 * @param {Boolean} params.showInt Remove the floating points
 * @param {String?} params.token An option of LSK and BTC
 */
const LiskAmount = ({
  val, showRounded, showInt, token, convert = true,
}) => {
  if (val === undefined) return (<span />);
  let value = convert === false ? val : fromRawLsk(val);
  if (showInt) value = getInt(value);
  else if (showRounded) value = trim(value);
  return (
    <>
      <FormattedNumber val={value} />
      {token && ` ${token}`}
    </>
  );
};

LiskAmount.defaultProps = {
  token: '',
};

export default LiskAmount;
