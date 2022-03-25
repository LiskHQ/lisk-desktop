import React from 'react';
import Input from './input';
import DropdownButton from './select/dropdownButton';
import styles from './input.css';

const InputWithDropdown = ({
  className, value, onChange, children, buttonLabel, buttonClassName, ButtonComponent, placeholder,
}) => (
  <div className={`${styles.inputWithDropdown} ${className} input-with-dropdown-container`}>
    <Input
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      size="m"
      className={`${styles.inputDropdownInput} input-with-dropdown-input`}
    />
    <DropdownButton
      className="input-with-dropdown-dropdown"
      buttonClassName={`${styles.inputDropdownButton} ${buttonClassName}`}
      buttonLabel={buttonLabel}
      size="s"
      ButtonComponent={ButtonComponent}
      align="right"
    >
      {children}
    </DropdownButton>
  </div>
);

export default InputWithDropdown;
