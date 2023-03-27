import React from 'react';
import styles from './styles.css';

const ValueAndLabel = ({ label, className, children, direction = 'vertical' }) => (
  <div className={`${styles.value} ${className} ${styles[direction]}`}>
    <span className={styles.label}>{label}</span>
    {children}
  </div>
);

export default ValueAndLabel;
