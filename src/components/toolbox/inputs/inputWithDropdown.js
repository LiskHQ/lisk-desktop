import React from 'react';

import Input from './input';
import DropdownButton from '../dropdownButton';

import styles from './input.css';

const InputWithDropdown = ({
  value, onChange, children, buttonLabel, ButtonComponent,
}) => (
  <div className={styles.inputWithDropdown}>
    <Input
      value={value}
      onChange={onChange}
      size="m"
      className={styles.inputDropdownInput}
    />
    <DropdownButton
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
