import React from 'react';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import styles from './walletDetails.css';
import LiskAmount from '../liskAmount';
import iconChart from '../../assets/images/icons-v2/icon-chart.svg';
import iconCal from '../../assets/images/icons-v2/icon-calendar.svg';
import iconLastTx from '../../assets/images/icons-v2/icon-last-tx.svg';
import transactionTypes from '../../constants/transactionTypes';

const walletDetails = ({
  balance, className, t, transactions, address,
}) => {
  const lastTx = {
    tx: { amount: 0 },
    pre: '',
  };

  if (transactions && transactions[0]) {
    lastTx.tx = transactions[0];
    if (lastTx.tx.senderId !== address) {
      lastTx.pre = '+';
    } else if (lastTx.tx.type === transactionTypes.send &&
        lastTx.tx.recipientId !== address) {
      lastTx.pre = '-';
    }
  }

  return (
    <BoxV2 className={`${className} ${styles.wrapper}`}>
      <header>
        <h1>{t('Wallet overview')}</h1>
      </header>
      <div className={`${styles.content}`}>
        <div className={`${styles.details}`}>
          <img className={`${styles.icon}`} src={iconChart} />
          <div className={`${styles.info}`}>
            <span className={`${styles.label}`}>{t('Account Balance')}</span>
            <span className={`${styles.value}`}>
              <LiskAmount val={balance} />
              <span className={`${styles.currency}`}> {t('LSK')}</span>
            </span>
          </div>
        </div>
        <div className={`${styles.details}`}>
          <img className={`${styles.icon}`} src={iconLastTx} />
          <div className={`${styles.info}`}>
            <span className={`${styles.label}`}>{t('Last Transaction')}</span>
            <span className={`${styles.value}`}>
              {lastTx.pre}<LiskAmount val={lastTx.tx.amount} />
              <span className={`${styles.currency}`}> {t('LSK')}</span>
            </span>
          </div>
        </div>
        <div className={`${styles.details}`}>
          <img className={`${styles.icon}`} src={iconCal} />
          <div className={`${styles.info}`}>
            <span className={`${styles.label}`}>{t('Since Last Visit')}</span>
            <span className={`${styles.value}`}>
              0
              <span className={`${styles.currency}`}> {t('LSK')}</span>
            </span>
          </div>
        </div>
      </div>
    </BoxV2>
  );
};

export default translate()(walletDetails);
