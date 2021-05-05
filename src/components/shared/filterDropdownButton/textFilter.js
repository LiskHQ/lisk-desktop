import React from 'react';
import { Input } from '@toolbox/inputs';

const TextFilter = ({
  filters, label, name, placeholder, updateCustomFilters, valueFormatter,
}) => {
  const onChange = ({ target }) => {
    updateCustomFilters({
      [name]: {
        value: valueFormatter(target.value),
        error: '',
        loading: false,
      },
    });
  };
  const inputProps = {
    label, name, placeholder, onChange,
  };
  return (
    <Input
      {...inputProps}
      value={filters[name]}
      className={name}
      size="m"
    />
  );
};

TextFilter.defaultProps = {
  valueFormatter: value => value,
};

export default TextFilter;
