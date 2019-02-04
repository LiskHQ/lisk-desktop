import React from 'react';
import styles from './spinnerV2.css';

const SpinnerV2 = ({ label }) => (
  <span className={styles.wrapper}>
    <span className={`${styles.spinner} spinner`}/>
    <span className={`${styles.label}`}>{label}</span>
  </span>
);

export default SpinnerV2;
