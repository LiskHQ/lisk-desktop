import React from 'react';
import styles from './spinnerV2.css';

const SpinnerV2 = ({ label, className, completed }) => (
  <span className={`${styles.wrapper} ${className}`}>
    <span className={`${styles.spinner} ${completed ? styles.completed : ''} spinner`} />
    {label
      ? <span className={`${styles.label} spinner-label`}>{label}</span>
      : null
    }
  </span>
);

SpinnerV2.defaultProps = {
  label: '',
  className: '',
  completed: false,
};

export default SpinnerV2;
