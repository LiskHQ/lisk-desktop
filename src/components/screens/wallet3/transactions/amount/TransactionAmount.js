import PropTypes from 'prop-types';
import React from 'react';
import LiskAmount from '../../../../shared/liskAmount';
import DiscreetMode from '../../../../shared/discreetMode';
import styles from './transactionAmount.css';
import transactionTypes from '../../../../../constants/transactionTypes';

const TransactionAmount = ({
  sender, recipient, type, token, roundTo, host, amount,
}) => {
  const isIncoming = host === recipient && sender !== recipient;
  return (
    <div className={`${styles.wrapper} transaction-amount`}>
      { type === transactionTypes().send.code
        ? (
          <DiscreetMode shouldEvaluateForOtherAccounts>
            <span className={isIncoming ? styles.receive : ''}>
              {isIncoming ? '' : '- '}
              <LiskAmount val={amount} roundTo={roundTo} token={token} />
            </span>
          </DiscreetMode>
        )
        : '-'
      }
    </div>
  );
};

TransactionAmount.propTypes = {
  host: PropTypes.string,
  sender: PropTypes.string.isRequired,
  recipient: PropTypes.string,
  token: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  amount: PropTypes.string,
  roundTo: PropTypes.number,
};

TransactionAmount.defaultProps = {
  roundTo: 8,
};

export default TransactionAmount;
