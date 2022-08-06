import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from '../TransactionInfo/TransactionInfo.css';
import chainLogo from '../../../../../setup/react/assets/images/LISK.png';

const Send = ({
  transaction = {}, t, token,
}) => (
  <>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <div className={styles.fromToChainWrapper}>
          <div>
            <label>{t('From Application')}</label>
            <div className={styles.chainWrapper}>
              <img className={styles.chainLogo} src={chainLogo} />
              <span>dfdf</span>
            </div>
          </div>
          <div>
            <label>{t('To Application')}</label>
            <div className={styles.chainWrapper}>
              <img className={styles.chainLogo} src={chainLogo} />
              <span>dfdf</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Amount')}</label>
        <span className={`${styles.valueText} amount-summary`}>
          <TokenAmount
            val={transaction.asset.amount}
            token={token}
          />
        </span>
      </div>
    </section>
    <section>
      <label>{t('Recipient Address')}</label>
      <label className="recipient-value">
        <WalletVisual address={transaction.asset.recipient.address} size={40} />
        <div className={styles.recipientDetail}>
          <span className={`${styles.information} recipient-confirm`}>
            <b>{transaction.asset.recipient.title}</b>
          </span>
          <span className={styles.secondText}>
            {transaction.asset.recipient.address}
          </span>
        </div>
      </label>
    </section>
    <section>
      <label>{t('Message')}</label>
      <span className={`${styles.valueText} message-value`}>
        {transaction.asset.data || '-'}
      </span>
    </section>
  </>
);

export default Send;
