import React from 'react';
import { fromRawLsk } from '../../../utils/lsk';
import FormattedNumber from '../formattedNumber';

const roundToPlaces = (value, places) => {
  if (!places) {
    return value;
  }
  const x = 10 ** places;
  return Math.round(value * x) / x;
};

const LiskAmount = ({ val, roundTo }) => (
  val !== undefined
    ? <FormattedNumber val={roundToPlaces(parseFloat(fromRawLsk(val)), roundTo)} />
    : <span />
);


export default LiskAmount;
