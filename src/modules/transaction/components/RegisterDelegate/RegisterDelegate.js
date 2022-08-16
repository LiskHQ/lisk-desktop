import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import styles from '../TransactionInfo/TransactionInfo.css'; // @todo create a dedicated css file for this component

const RegisterDelegate = ({ account, transaction, t }) => (
  <section>
    <label className="username-label">{t('Your username')}</label>
    <div className={styles.userInformation}>
      <WalletVisual
        className={styles.walletVisual}
        address={account.summary?.address}
        size={25}
      />
      <span className={`${styles.username} username`}>{transaction.params.username}</span>
      <span className={`${styles.address} address`}>{account.summary?.address}</span>
    </div>
  </section>
);

export default RegisterDelegate;
