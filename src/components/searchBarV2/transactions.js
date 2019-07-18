import React from 'react';
import LiskAmount from '../liskAmount';
import styles from './transactions.css';
import svg from '../../utils/svgIcons';
import transactionTypes from '../../constants/transactionTypes';

const Transactions = ({
  t, transactions, onSelectedRow, rowItemIndex, updateRowItemIndex,
}) => {
  function selectTransactionType() {
    return {
      [transactionTypes.send]: {
        subTitle: t('Amount'),
        value: transactions[0].amount,
      },
      [transactionTypes.setSecondPassphrase]: {
        icon: svg.tx2ndPassphrase,
        subTitle: t('Fee'),
        value: transactions[0].fee,
      },
      [transactionTypes.registerDelegate]: {
        icon: svg.txDelegate,
        subTitle: t('Fee'),
        value: transactions[0].fee,
      },
      [transactionTypes.vote]: {
        icon: svg.txVote,
        subTitle: t('Fee'),
        value: transactions[0].fee,
      },
    }[transactions[0].type] || {
      icon: svg.txDefault,
      subTitle: t('Amount'),
      value: transactions[0].amount,
    };
  }

  const transactionType = selectTransactionType();

  return (
    <div className={`${styles.wrapper} transactions`}>
      <header className={`${styles.header} transactions-header`}>
        <div className={`${styles.subTitles} transactions-subtitle`}>
          <label>{t('Transaction')}</label>
          <label>{transactionType.subTitle}</label>
        </div>
      </header>
      <div className={`${styles.content} transactions-content`}>
        {
          transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              data-index={index}
              className={`${styles.transactionRow} ${rowItemIndex === index ? styles.active : ''} search-transaction-row`}
              onClick={() => onSelectedRow(transaction.id)}
              onMouseEnter={updateRowItemIndex}
            >
              {transactionType.icon ? <img src={transactionType.icon} /> : null }
              <span className={`${styles.transactionId} transaction-id`}>{transaction.id}</span>
              <span className={styles.transactionMessage}>
                <LiskAmount val={transactionType.value} />
                <span>{t(' LSK')}</span>
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Transactions;
