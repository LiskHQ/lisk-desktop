import React from 'react';
import styles from './spinner.css';

const Spinner = () => (
  <span className={styles.spinner}>
    <div className={styles.bounce1} />
    <div className={styles.bounce2} />
    <div className={styles.bounce3} />
  </span>
);

export default Spinner;
