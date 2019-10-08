import React from 'react';
import styles from './blockDetails.css';

const LabeledValue = ({ label, children }) => (
  <div className={styles.dataContainer}>
    <label>{label}</label>
    <span>{children}</span>
  </div>
);

export default LabeledValue;
