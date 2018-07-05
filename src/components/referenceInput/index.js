import React from 'react';
import Input from '../toolbox/inputs/input';

const ReferenceInput = ({
  handleChange, className, address, label,
}) => (
    <Input
      className={className}
      label={label}
      error={address.error}
      value={address.value}
      onChange={val => handleChange(val)}
      />);

export default ReferenceInput;

