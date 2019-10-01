import React from 'react';
import { Input } from '../../toolbox/inputs';

const TextFilter = ({
  value, label, name, placeholder, updateCustomFilters,
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
    label, name, placeholder, value, onChange,
  };
  return (
    <Input
      {...inputProps}
      className={name}
      size="xs"
    />
  );
};

export default TextFilter;
