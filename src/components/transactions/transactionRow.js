import React from 'react';
import LiskAmount from '../liskAmount';
import { TooltipTime, TooltipWrapper } from '../timestamp';
import TransactionType from './transactionType';
import styles from './transactions.css';
import Status from './status';
import Amount from './amount';

const TransactionRow = props => (
  <tr>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
        <TooltipTime label={props.value.timestamp}></TooltipTime>
    </td>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
        <TooltipWrapper tooltip={`${props.value.confirmations} confirmations`}>{props.value.id}</TooltipWrapper>
    </td>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
      <TransactionType {...props.value}></TransactionType>
    </td>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
      <Status {...props}></Status>
    </td>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
      <Amount {...props}></Amount>
    </td>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
      <span className={styles.grayButton}>
        <LiskAmount val={props.value.fee} />
      </span>
    </td>
  </tr>
);

export default TransactionRow;
