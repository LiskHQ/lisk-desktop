import React, { useMemo } from 'react';
import styles from './txSummarizer.css';

// eslint-disable-next-line max-statements
const FeeSummarizer = ({
  fees,
}) => {
  const composedFeeList = useMemo(() =>
    Object.keys(fees).map(feeKey => ({ title: feeKey, value: fees[feeKey] })), [fees]);

  return (
    <div className={styles.feesListWrapper}>
      {composedFeeList.map(({ title, value }) => (
        <div className={styles.feeRow} key={title}>
          <span>{title}</span>
          <span className={`${styles.value} fee-value-${title}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeeSummarizer;
