import React from 'react';
import LiskAmount from '../liskAmount';
import { TooltipTime, TooltipWrapper } from '../timestamp';
import TransactionType from './transactionType';
import styles from './transactions.css';
import Status from './status';
import Amount from './amount';
import Spinner from '../spinner';

const TransactionRow = props => (
  <tr>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
        {props.value.confirmations ?
          <TooltipTime label={props.value.timestamp}></TooltipTime> :
          <Spinner />}
    </td>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText} ${styles.hiddenXs}`}>
        <TooltipWrapper tooltip={`${props.value.confirmations || 0} confirmation${props.value.confirmations !== 1 ? 's' : ''}`}>{props.value.id}</TooltipWrapper>
    </td>
    <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
      <TransactionType {...props.value} address={props.address}></TransactionType>
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
