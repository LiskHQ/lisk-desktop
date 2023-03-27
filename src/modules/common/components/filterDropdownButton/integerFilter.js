import React from 'react';
import TextFilter from './textFilter';

const IntegerFilter = (props) => {
  const replaceNonDigits = (value) => value?.replace(/[^\d]/g, '');
  return <TextFilter {...props} valueFormatter={replaceNonDigits} />;
};

export default IntegerFilter;
