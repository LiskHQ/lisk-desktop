import PropTypes from 'prop-types';
import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import LiskAmount from '../liskAmount';
import DiscreetMode from '../discreetMode';
import styles from './transactionAmount.css';

const TransactionAmount = ({
  recipient, moduleAssetId, token, showRounded, showInt, host, amount,
}) => {
  const isIncoming = host === recipient
    || moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.unlockToken;
  return (
    <div className={`${styles.wrapper} transaction-amount`}>
      { moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer
        || moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.unlockToken
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
