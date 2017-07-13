import React from 'react';
import FormattedNumber from '../formattedNumber';
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
        <FormattedNumber val={props.value.fee}></FormattedNumber>
      </span>
    </td>
  </tr>
);

export default TransactionRow;
