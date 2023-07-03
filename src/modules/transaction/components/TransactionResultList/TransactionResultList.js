import React from 'react';
import { truncateAddress } from '@wallet/utils/account';
import Icon from 'src/theme/Icon';
import {
  MODULE_COMMANDS_MAP,
  MODULE_COMMANDS_NAME_MAP,
} from '@transaction/configuration/moduleCommand';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './TransactionResultList.css';

const getTxConfig = (t, transactions) => {
  const { params, fee } = transactions[0];

  return {
    icon:
      transactions[0].moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer
        ? undefined
        : MODULE_COMMANDS_MAP[MODULE_COMMANDS_NAME_MAP.transfer].icon,
    subTitle:
      transactions[0].moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer ? t('Amount') : t('Fee'),
    value:
      transactions[0].moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer ? params.amount : fee,
  };
};

const Transactions = ({
  t,
  transactions,
  onSelectedRow,
  rowItemIndex,
  updateRowItemIndex,
  activeToken,
}) => {
  const txConfig = getTxConfig(t, transactions);

  return (
    <div className={`${styles.wrapper} transactions`}>
      <header className={`${styles.header} transactions-header`}>
        <div className={`${styles.subTitles} transactions-subtitle`}>
          <label>{t('Transaction')}</label>
          <label>{txConfig.subTitle}</label>
        </div>
      </header>
      <div className={`${styles.content} transactions-content`}>
        <div
          data-index={0}
          className={`${styles.resultRow} ${
            rowItemIndex === 0 ? styles.active : ''
          } search-transaction-row`}
          onClick={() => onSelectedRow(transactions[0].id)}
          onMouseEnter={updateRowItemIndex}
        >
          {txConfig.icon ? <Icon name={txConfig.icon} /> : null}
          <span className={`${styles.transactionId} transaction-id`}>
            {truncateAddress(transactions[0].id)}
          </span>
          <span className={styles.transactionMessage}>
            <TokenAmount val={txConfig.value} token={activeToken} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
