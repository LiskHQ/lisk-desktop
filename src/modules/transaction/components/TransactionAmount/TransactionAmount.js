import PropTypes from 'prop-types';
import React from 'react';
import LiskAmount from '@shared/liskAmount';
import DiscreetMode from '@shared/discreetMode';
import styles from './TransactionAmount.css';
import { getTxDirectionConfig } from '../../utils/helpers'

const TransactionAmount = ({
  recipient, moduleAssetId, token, showRounded, showInt, host, amount,
}) => {
  const config = getTxDirectionConfig(moduleAssetId, host, recipient);
  return (
    <div className={`${styles.wrapper} transaction-amount`}>
      { config
        ? (
          <DiscreetMode shouldEvaluateForOtherAccounts>
            <span className={config.style}>
              {config.sign}
              <LiskAmount
                val={amount}
                showRounded={showRounded}
                showInt={showInt}
                token={token}
              />
            </span>
          </DiscreetMode>
        )
        : '-'}
    </div>
  );
};

TransactionAmount.propTypes = {
  host: PropTypes.string,
  recipient: PropTypes.string,
  token: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  showInt: PropTypes.bool,
  showRounded: PropTypes.bool,
};

export default TransactionAmount;
