import React from 'react';
import styles from './multiStepProgressBar.css';

const MultiStepProgressBar = ({ total, current }) => {
  const steps = new Array(total).fill('');

  return (
    <div className={styles.container}>
      {steps.map((_, i) => (
        <div className={current >= i ? styles.active : styles.inactive} key={i} />
      ))}
    </div>
  );
};

export default MultiStepProgressBar;
