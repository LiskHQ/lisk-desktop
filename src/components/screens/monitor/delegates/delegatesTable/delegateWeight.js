import React from 'react';
import { formatAmountBasedOnLocale } from '../../../../../utils/formattedNumber';
import { fromRawLsk } from '../../../../../utils/lsk';

const DelegateWeight = ({ value }) => {
  const format = '0a';
  const formatted = formatAmountBasedOnLocale({
    value: fromRawLsk(value),
    format,
  });

  return <span>{formatted}</span>;
};

export default DelegateWeight;
