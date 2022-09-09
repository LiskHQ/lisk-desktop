import React from 'react';
import { truncateAddress } from '@wallet/utils/account';
import Icon from 'src/theme/Icon';
import { getTxConfig } from '@search/utils';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './TransactionResultList.css';

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
