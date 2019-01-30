import React from 'react';
import TransactionType from './transactionType';
import styles from './rows.css';
import Amount from './amount';
import Spinner from '../spinner';
import { DateFromTimestamp } from './../timestamp/index';

class Row extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    return nextProps.value.id !== this.props.value.id || nextProps.value.confirmations <= 1000;
  }

  render() {
    const { props } = this;
    const onClick = !props.onClick ? (() => {}) : () => props.onClick(this.props);

    return (
      <div
        className={`${styles.row} transactions-row`}
        onClick={onClick}
      >
        <div className={'transactions-cell'}>
          <div className={'transaction-address'}>
            <TransactionType {...props.value} address={props.address}></TransactionType>
          </div>
        </div>
        <div className={`${styles.date} transactions-cell`}>
          {
            props.value.confirmations
            ? <DateFromTimestamp time={props.value.timestamp} />
            : <Spinner />
          }
        </div>
        <div className={`${styles.amount} transactions-cell`}>
          <Amount {...props}></Amount>
          <span>{props.t('LSK')}</span>
        </div>
      </div>
    );
  }
}

export default (Row);
