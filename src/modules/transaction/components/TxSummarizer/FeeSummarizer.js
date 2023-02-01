import React from 'react';
import styles from './txSummarizer.css';

const FeeSummarizer = ({ fees }) => {
  const composedFeeList = fees.filter(({ isHidden }) => !isHidden);

  return (
    <div className={styles.feesListWrapper}>
      {composedFeeList.map(({ title, value }) => (
        <div className={styles.feeRow} key={title}>
          <span>{title}</span>
          <span className={`${styles.value} fee-value-${title}`}>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default FeeSummarizer;
