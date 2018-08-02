import React from 'react';
import Input from '../toolbox/inputs/input';
import AccountVisual from '../accountVisual';
import styles from './addressInput.css';

const AddAccountID = ({
  handleChange, className, address, label,
}) => {
  const showAccountVisual = address.value.length && !address.error;

  return <Input
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
    </Input>;
};

export default AddAccountID;
