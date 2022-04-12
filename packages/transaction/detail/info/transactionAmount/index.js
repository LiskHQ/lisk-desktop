import PropTypes from 'prop-types';
import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import LiskAmount from '@shared/liskAmount';
import DiscreetMode from '@shared/discreetMode';
import styles from './transactionAmount.css';

const getTxDirectionConfig = (moduleAssetId, host, recipient) => {
  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.unlockToken
    || moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.reclaimLSK) {
    return {
      sign: '',
      style: styles.unlock,
    };
  }
  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer && host === recipient) {
    return {
      sign: '',
      style: styles.receive,
    };
  }
  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer) {
    return {
      sign: '- ',
      style: '',
    };
  }
  return false;
};

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
