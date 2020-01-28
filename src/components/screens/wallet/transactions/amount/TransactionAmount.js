import PropTypes from 'prop-types';
import React from 'react';
import LiskAmount from '../../../../shared/liskAmount';
import DiscreetMode from '../../../../shared/discreetMode';
import styles from './transactionAmount.css';
import transactionTypes from '../../../../../constants/transactionTypes';

const TransactionAmount = ({
  address, transaction, token, roundTo,
}) => {
  const isRecieve = address === transaction.recipientId;
  // e.g. account initialization
  const isSentToSelf = transaction.recipientId === transaction.senderId
    && transaction.type === transactionTypes().send.code;

  return (
    <div className={`${styles.wrapper} transaction-amount`}>
      { transaction.type === transactionTypes().send.code
        ? (
          <DiscreetMode shouldEvaluateForOtherAccounts>
            <span className={isRecieve && !isSentToSelf ? styles.recieve : ''}>
              {isRecieve ? '' : '- '}
              <LiskAmount val={transaction.amount} roundTo={roundTo} />
              {' '}
              {token}
            </span>
          </DiscreetMode>
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
