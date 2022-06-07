import React from 'react';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import FormattedNumber from 'src/modules/common/components/FormattedNumber';

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
 * Displays the LSK amount with Token sign next to the value
 *
 * @param {Object} params
 * @param {Boolean?} params.convert Should convert the value to Beddows. Default true.
 * @param {String} params.val Amount in Beddows or LSK
 * @param {Boolean} params.showRounded Round the number (decimal)
 * @param {Boolean} params.showInt Remove the floating points
 * @param {String?} params.token An option of LSK or any other token
 */
const TokenAmount = ({
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

TokenAmount.defaultProps = {
  token: '',
};

export default TokenAmount;
