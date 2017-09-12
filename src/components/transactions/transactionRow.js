import React from 'react';
import numeral from 'numeral';
import LiskAmount from '../liskAmount';
import { TooltipTime, TooltipWrapper } from '../timestamp';
import TransactionType from './transactionType';
import styles from './transactions.css';
import Status from './status';
import Amount from './amount';
import Spinner from '../spinner';

class TransactionRow extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    return nextProps.value.confirmations <= 1000;
  }

  render() {
    const props = this.props;
    return (<tr>
      <td className={`${props.tableStyle.rowCell} ${styles.centerText}`}>
        {props.value.confirmations ?
          <TooltipTime label={props.value.timestamp}></TooltipTime> :
          <Spinner />}
      </td>
      <td className={`${props.tableStyle.rowCell} ${styles.centerText} ${styles.hiddenXs}`}>
        <TooltipWrapper tooltip={`${numeral(props.value.confirmations || 0).format('0a')} confirmation${props.value.confirmations !== 1 ? 's' : ''}`}>{props.value.id}</TooltipWrapper>
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
    </tr>);
  }
}

export default TransactionRow;
