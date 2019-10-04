import React from 'react';
import { Input } from '../../toolbox/inputs';

const TextFilter = ({
  filters, label, name, placeholder, updateCustomFilters,
}) => {
  const onChange = ({ target }) => {
    updateCustomFilters({
      [name]: {
        value: target.value,
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
      size="xs"
    />
  );
};

export default TextFilter;
