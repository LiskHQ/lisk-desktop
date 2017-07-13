import React from 'react';
import FormattedNumber from '../formattedNumber';
import { TooltipTime, TooltipWrapper } from '../timestamp';
import TransactionType from './transactionType';
import styles from './transactions.css';

const TransactionRow = ({ tableStyle, value }) => (
  <tr>
    <td className={`${tableStyle.rowCell} ${styles.centerText}`}>
        <TooltipTime label={value.timestamp}></TooltipTime>
    </td>
    <td className={`${tableStyle.rowCell} ${styles.centerText}`}>
        <TooltipWrapper tooltip={`${value.confirmations} confirmations`}>{value.id}</TooltipWrapper>
    </td>
    <td className={`${tableStyle.rowCell} ${styles.centerText}`}>
      <TransactionType {...value}></TransactionType>
    </td>
    <td className={`${tableStyle.rowCell} ${styles.centerText}`}>
      {value.type}
    </td>
    <td className={`${tableStyle.rowCell} ${styles.centerText}`}>
        <FormattedNumber val={value.amount}></FormattedNumber>
    </td>
    <td className={`${tableStyle.rowCell} ${styles.centerText}`}>
        <span className={styles.grayButton}>
          <FormattedNumber val={value.fee}></FormattedNumber>
        </span>
    </td>
  </tr>
);

export default TransactionRow;
