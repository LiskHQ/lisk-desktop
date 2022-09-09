import React from 'react';
import DropdownButton from 'src/theme/DropdownButton';
import Input from '../Input/Input';
import styles from '../Input/input.css';

const DropdownInput = ({
  className,
  value,
  onChange,
  children,
  buttonLabel,
  buttonClassName,
  ButtonComponent,
  placeholder,
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

export default DropdownInput;
