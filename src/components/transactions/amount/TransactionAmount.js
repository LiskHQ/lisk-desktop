import PropTypes from 'prop-types';
import React from 'react';
import LiskAmount from '../../liskAmount';
import styles from './transactionAmount.css';
import transactionTypes from '../../../constants/transactionTypes';

const TransactionAmount = ({
  address, transaction, token, roundTo,
}) => {
  const isRecieve = address === transaction.recipientId;
  return (
    <div className={`${styles.wrapper} transaction-amount`}>
      { transaction.type === transactionTypes.send
        ? (
          <span className={isRecieve ? styles.recieve : ''}>
            {isRecieve ? '' : '- '}
            <LiskAmount val={transaction.amount} roundTo={roundTo} />
            {' '}
            {token}
          </span>
        )
        : '-'
      }
    </div>
  );
};

TransactionAmount.propTypes = {
  address: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.number.isRequired,
    amount: PropTypes.string.isRequired,
    recipientId: PropTypes.string.isRequired,
  }),
  roundTo: PropTypes.number,
};

TransactionAmount.defaultProps = {
  roundTo: 8,
};

export default TransactionAmount;
