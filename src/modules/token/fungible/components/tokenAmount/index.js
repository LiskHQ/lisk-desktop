/* eslint-disable complexity */
import React, { useMemo } from 'react';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import DiscreetMode from 'src/modules/common/components/discreetMode';
import FormattedNumber from 'src/modules/common/components/FormattedNumber';

const trimReg = /([0-9,]+\.(([0]{0,2})[1-9]{1,2})?)|-?(0\.([0]+)?[1-9]{1,2})/g;
const IntegerReg = /\.([0-9]+)/g;

const trim = (value) => {
  const matched = value.match(trimReg);
  const isMatched = matched && matched[0] !== '0.';
  return isMatched ? matched[0].replace(/\.$/, '') : value;
};

const getInt = (value) => value.replace(IntegerReg, '');

/**
 * Displays the LSK amount with Token sign next to the value
 */
const TokenAmount = ({
  isLsk,
  className,
  val,
  showRounded,
  showInt,
  isStake,
  token = {},
  convert = true,
  Wrapper = DiscreetMode,
}) => {
  if (val === undefined) return <span />;

  const converted = isLsk ? convertFromBaseDenom(val) : convertFromBaseDenom(val, token);

  const amountValue = useMemo(() => {
    let value = !convert ? val : converted;

    if (showInt) value = getInt(value);
    else if (showRounded) value = trim(value);

    if (isStake) return +value - (+value % 10);

    return value;
  }, [converted, token, isStake]);

  return (
    <Wrapper {...(className && { className })}>
      <FormattedNumber val={amountValue} />
      {isLsk ? ' LSK' : ` ${token?.symbol || ''}`}
    </Wrapper>
  );
};

TokenAmount.defaultProps = {
  token: {},
};

export default TokenAmount;
