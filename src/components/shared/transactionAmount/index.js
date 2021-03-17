import PropTypes from 'prop-types';
import React from 'react';
import { MODULE_ASSETS } from '@constants';
import LiskAmount from '../liskAmount';
import DiscreetMode from '../discreetMode';
import styles from './transactionAmount.css';

const TransactionAmount = ({
  recipient, type, token, showRounded, showInt, host, amount,
}) => {
  const isIncoming = host === recipient
    || type === MODULE_ASSETS.unlockToken;
  return (
    <div className={`${styles.wrapper} transaction-amount`}>
      { type === MODULE_ASSETS.transfer
        || type === MODULE_ASSETS.unlockToken
        ? (
          <DiscreetMode shouldEvaluateForOtherAccounts>
            <span className={isIncoming ? styles.receive : ''}>
              {isIncoming ? '' : '- '}
              <LiskAmount
                val={amount}
                showRounded={showRounded}
                showInt={showInt}
                token={token}
              />
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
  recipient: PropTypes.string,
  token: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  amount: PropTypes.string,
  showInt: PropTypes.bool,
  showRounded: PropTypes.bool,
};

export default TransactionAmount;
