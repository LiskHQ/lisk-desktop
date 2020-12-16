import React from 'react';
import AccountVisual from '../../toolbox/accountVisual';
import TransactionSummary from '../../shared/transactionSummary';

import styles from './secondPassphrase.css';

const SummaryStep = ({
  t, account, prevStep,
}) => (
  <TransactionSummary
    title={t('Register 2nd passphrase summary')}
    account={account}
    t={t}
    confirmButton={{
      label: t('Register'),
      onClick: () => {},
    }}
    cancelButton={{
      label: t('Go back'),
      onClick: prevStep,
    }}
    fee={25}
    confirmation={t('I’m aware registering a 2nd passphrase is irreversible and it will be required to confirm transactions.')}
    classNames={`${styles.box} ${styles.passphraseConfirmation}`}
    footerClassName={styles.confirmPassphraseFooter}
  >
    <section>
      <label>{t('Account')}</label>
      <label className={styles.account}>
        <AccountVisual address={account.address} size={25} className={styles.avatar} />
        {account.address}
      </label>
    </section>
  </TransactionSummary>
);

export default SummaryStep;
