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

const LiskAmount = props => (
  props.val !== undefined
    ? <FormattedNumber val={roundTo(parseFloat(fromRawLsk(props.val)), props.roundTo)} />
    : <span />
);


export default LiskAmount;
