import React from 'react';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import AccountVisual from '../accountVisual';
import styles from './addressInput.css';

const AddressInput = ({
  handleChange, className, address, label,
}) => {
  const showAccountVisual = address.value.length && !address.error;

  return <ToolBoxInput
    className={className}
    label={label}
    error={address.error}
    value={address.value}
    autoFocus={true}
    onChange={val => handleChange(val)}
    theme={showAccountVisual ? styles : {}}
  >
    {showAccountVisual
      ? <figure className={styles.accountVisualInInput}>
        <AccountVisual address={address.value} size={50} />
      </figure>
      : null
    }
  </ToolBoxInput>;
};

export default AddressInput;
