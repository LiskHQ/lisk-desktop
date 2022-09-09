import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './send.css';
import chainLogo from '../../../../../setup/react/assets/images/LISK.png';

const Send = ({ transaction = {}, t, transactionData }) => (
  <>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <div className={styles.fromToChainWrapper}>
          <div>
            <label>{t('From Application')}</label>
            <div className={styles.chainWrapper}>
              <img className={styles.chainLogo} src={chainLogo} />
              <span>{transactionData.sendingChain.name}</span>
            </div>
          </div>
          <div>
            <label>{t('To Application')}</label>
            <div className={styles.chainWrapper}>
              <img className={styles.chainLogo} src={chainLogo} />
              <span>{transactionData.recipientChain.name}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Amount')}</label>
        <span className={`${styles.valueText} amount-summary`}>
          <TokenAmount val={transaction.params.amount} token={transactionData.token.symbol} />
        </span>
      </div>
    </section>
    <section>
      <label>{t('Recipient Address')}</label>
      <label className="recipient-value">
        <WalletVisual address={transaction.params.recipient.address} size={40} />
        <div className={styles.recipientDetail}>
          <span className={`${styles.information} recipient-confirm`}>
            <b>{transaction.params.recipient.title}</b>
          </span>
          <span className={styles.secondText}>{transaction.params.recipient.address}</span>
        </div>
      </label>
    </section>
    <section>
      <label>{t('Message')}</label>
      <span className={`${styles.valueText} message-value`}>{transaction.params.data || '-'}</span>
    </section>
  </>
);

export default Send;
