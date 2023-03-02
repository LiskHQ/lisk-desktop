import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { getLogo } from '@token/fungible/utils/service';
import styles from './send.css';

const Send = ({ formProps = {}, transactionJSON, t }) => (
  <>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <div className={styles.fromToChainWrapper}>
          <div>
            <label>{t('From Application')}</label>
            <div className={styles.chainWrapper}>
              <img className={styles.chainLogo} src={getLogo(formProps.fields.sendingChain)} />
              <span>{formProps.fields.sendingChain.chainName}</span>
            </div>
          </div>
          <div>
            <label>{t('To Application')}</label>
            <div className={styles.chainWrapper}>
              <img className={styles.chainLogo} src={getLogo(formProps.fields.recipientChain)} />
              <span>{formProps.fields.recipientChain.chainName}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Amount')}</label>
        <span className={`${styles.valueText} amount-summary`}>
          <TokenAmount val={transactionJSON.params.amount} token={formProps.fields.token} />
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
          <span className={`${styles.secondText} recipient-address`}>
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
