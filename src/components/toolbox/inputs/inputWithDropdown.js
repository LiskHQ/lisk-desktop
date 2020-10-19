import React from 'react';

import Input from './input';
import DropdownButton from '../dropdownButton';

import styles from './input.css';

const InputWithDropdown = ({
  className, value, onChange, children, buttonLabel, ButtonComponent,
}) => (
  <div className={`${styles.inputWithDropdown} ${className} input-with-dropdown-container`}>
    <Input
      value={value}
      onChange={onChange}
      size="m"
      className={`${styles.inputDropdownInput} input-with-dropdown-input`}
    />
    <DropdownButton
      className="input-with-dropdown-dropdown"
      buttonClassName={styles.inputDropdownButton}
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
