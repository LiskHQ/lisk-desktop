import React from 'react';
import styles from './transactions.css';

const TransactionsHeader = ({ tableStyle }) => (
  <thead>
    <tr>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}>Time</th>
      <th className={`${tableStyle.headCell} ${styles.centerText} ${styles.hiddenXs}`}>Transaction ID</th>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}>From / To</th>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}></th>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}>Amount</th>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}>Fee</th>
    </tr>
  </thead>);

export default TransactionsHeader;
