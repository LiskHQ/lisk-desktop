import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './send.css';
import chainLogo from '../../../../../setup/react/assets/images/LISK.png';

const Send = ({
  formProps = {}, transactionJSON, t,
}) => (
  <>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <div className={styles.fromToChainWrapper}>
          <div>
            <label>{t('From Application')}</label>
            <div className={styles.chainWrapper}>
              <img className={styles.chainLogo} src={chainLogo} />
              <span>{formProps.fields.sendingChain.name}</span>
            </div>
          </div>
          <div>
            <label>{t('To Application')}</label>
            <div className={styles.chainWrapper}>
              <img className={styles.chainLogo} src={chainLogo} />
              <span>{formProps.fields.recipientChain.name}</span>
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
            val={transactionJSON.params.amount}
            token={formProps.fields.token.symbol}
          />
        </span>
      </div>
    </section>
    <section>
      <label>{t('Recipient Address')}</label>
      <label className="recipient-value">
        <WalletVisual address={transactionJSON.params.recipientAddress} size={40} />
        <div className={styles.recipientDetail}>
          <span className={`${styles.information} recipient-confirm`}>
            <b>{formProps.fields.recipient.title}</b>
          </span>
          <span className={styles.secondText}>
            {transactionJSON.params.recipientAddress}
          </span>
        </div>
      </label>
    </section>
    <section>
      <label>{t('Message')}</label>
      <span className={`${styles.valueText} message-value`}>
        {transactionJSON.params.data || '-'}
      </span>
    </section>
  </>
);

export default Send;
