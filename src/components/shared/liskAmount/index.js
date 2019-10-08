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

const LiskAmount = ({ val, roundTo, token }) => (
  val !== undefined
    ? (
      <React.Fragment>
        <FormattedNumber val={roundToPlaces(parseFloat(fromRawLsk(val)), roundTo)} />
        {token && ` ${token}`}
      </React.Fragment>
    )
    : <span />
);

LiskAmount.defaultProps = {
  token: '',
};

export default LiskAmount;
