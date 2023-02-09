import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import styles from './registerValidator.css';

const RegisterValidator = ({ account, transactionJSON, t }) => (
  <section>
    <div className={`${styles.dataRow} username`}>
      <label className="username-label">{t('Validator name')}</label>
      <div className={styles.userInformation}>
        <WalletVisual
          className={styles.walletVisual}
          address={account.summary?.address}
          size={40}
        />
        <div className={styles.titles}>
          <span className={`${styles.username} username`}>{transactionJSON.params.username}</span>
          <span className={`${styles.address} address`}>{account.summary?.address}</span>
        </div>
      </div>
    </div>
    <div className={`${styles.dataRow} bls-public-key`}>
      <label>{t('BLS key')}</label>
      <span>{transactionJSON.params.blsKey}</span>
    </div>
    <div className={`${styles.dataRow} generator-key`}>
      <label>{t('Generator public key')}</label>
      <span>{transactionJSON.params.generatorKey}</span>
    </div>
    <div className={`${styles.dataRow} pop`}>
      <label>{t('BLS proof of possession')}</label>
      <span>{transactionJSON.params.proofOfPossession}</span>
    </div>
  </section>
);

export default RegisterValidator;
