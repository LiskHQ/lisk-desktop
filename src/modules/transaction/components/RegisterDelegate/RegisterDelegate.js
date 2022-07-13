import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import styles from './registerDelegate.css';

const RegisterDelegate = ({ account, transaction, t }) => (
  <section>
    <div className={`${styles.dataRow} username`}>
      <label className="username-label">{t('Your username')}</label>
      <div className={styles.userInformation}>
        <WalletVisual
          className={styles.walletVisual}
          address={account.summary?.address}
          size={40}
        />
        <div className={styles.titles}>
          <span className={`${styles.username} username`}>{transaction.asset.username}</span>
          <span className={`${styles.address} address`}>{account.summary?.address}</span>
        </div>
      </div>
    </div>
    <div className={`${styles.dataRow} generator-key`}>
      <label>{t('Generator key')}</label>
      <span>{transaction.asset.generatorPublicKey}</span>
    </div>
    <div className={`${styles.dataRow} bls-public-key`}>
      <label>{t('BLS key')}</label>
      <span>{transaction.asset.blsPublicKey}</span>
    </div>
    <div className={`${styles.dataRow} pop`}>
      <label>{t('BLS Proof of possession')}</label>
      <span>{transaction.asset.proofOfPossession}</span>
    </div>
  </section>
);

export default RegisterDelegate;
