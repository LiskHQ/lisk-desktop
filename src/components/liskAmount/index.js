import React from 'react';
import { fromRawLsk } from '../../utils/lsk';
import FormattedNumber from '../formattedNumber';

const roundTo = (value, places) => {
  if (!places) {
    return value;
  }
  const x = 10 ** places;
  return Math.round(value * x) / x;
};

const LiskAmount = props => (<FormattedNumber val={
  roundTo(parseFloat(fromRawLsk(props.val)), props.roundTo)} />);

export default LiskAmount;

