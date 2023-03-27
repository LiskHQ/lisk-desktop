import PropTypes from 'prop-types';
import React from 'react';
import TokenAmount from '@token/fungible/components/tokenAmount';
import DiscreetMode from 'src/modules/common/components/discreetMode';
import getTxDirectionConfig from '../../utils/helpers';
import styles from './TransactionAmount.css';

const TransactionAmount = ({
  recipient,
  moduleCommand,
  token,
  showRounded,
  showInt,
  host,
  amount,
}) => {
  const config = getTxDirectionConfig(moduleCommand, host, recipient, styles);
  return (
    <div className={`${styles.wrapper} transaction-amount`}>
      {config ? (
        <DiscreetMode shouldEvaluateForOtherAccounts>
          <span className={`${styles.amountValue} ${config.style}`}>
            {config.sign}
            <TokenAmount val={amount} showRounded={showRounded} showInt={showInt} token={token} />
          </span>
        </DiscreetMode>
      ) : (
        '-'
      )}
    </div>
  );
};

TransactionAmount.propTypes = {
  host: PropTypes.string,
  recipient: PropTypes.string,
  token: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showInt: PropTypes.bool,
  showRounded: PropTypes.bool,
};

export default TransactionAmount;
