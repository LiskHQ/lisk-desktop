import React from 'react';
import { formatAmountBasedOnLocale } from '@utils/formattedNumber';
import { fromRawLsk } from '@utils/lsk';

const DelegateWeight = ({ value }) => {
  const formatted = formatAmountBasedOnLocale({
    value: fromRawLsk(value),
    format: '0a',
  });

  return <span>{formatted}</span>;
};

export default DelegateWeight;
