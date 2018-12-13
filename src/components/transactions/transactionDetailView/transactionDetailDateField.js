import React from 'react';
import { TimeFromTimestamp, DateFromTimestamp } from '../../timestamp/index';
import TransactionDetailViewField from './transactionDetailViewField';

const DateField = props => (
  <TransactionDetailViewField
    label={props.t('Date')}
    className={'tx-date'}
    value={ props.transaction.timestamp
      ? <span>
        <DateFromTimestamp
          time={props.transaction.timestamp} /> - <TimeFromTimestamp
          time={props.transaction.timestamp}/>
      </span>
      : <span>{props.t('Pending')}</span>
    } />
);

export default DateField;
