import React from 'react';
import styles from './Spinner.css';

const Spinner = ({ label, className, completed }) => (
  <span className={`${styles.wrapper} ${className}`} data-testid="spinner">
    <span className={`${styles.spinner} ${completed ? styles.completed : ''} spinner`} />
    {label ? <span className={`${styles.label} spinner-label`}>{label}</span> : null}
  </span>
);

Spinner.defaultProps = {
  label: '',
  className: '',
  completed: false,
};

export default Spinner;
