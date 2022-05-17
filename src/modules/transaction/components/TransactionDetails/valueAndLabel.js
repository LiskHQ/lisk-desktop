import React from 'react';
import styles from './styles.css';

const ValueAndLabel = ({ label, className, children }) => (
  <div className={`${styles.value} ${className}`}>
    <span className={styles.label}>{label}</span>
    {children}
  </div>
);

export default ValueAndLabel;
