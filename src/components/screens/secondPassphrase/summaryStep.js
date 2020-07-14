import React from 'react';
import { fromRawLsk } from '../../../utils/lsk';
import AccountVisual from '../../toolbox/accountVisual';
import Fees from '../../../constants/fees';
import TransactionSummary from '../../shared/transactionSummary';

import styles from './secondPassphrase.css';

const SummaryStep = ({
  t, account, prevStep, nextStep, secondPassphrase, secondPassphraseRegistered,
}) => (
  <TransactionSummary
    title={t('Register 2nd passphrase summary')}
    account={account}
    t={t}
    confirmButton={{
      label: t('Register'),
      onClick: () => {
        secondPassphraseRegistered({
          secondPassphrase,
          passphrase: account.passphrase,
          account: account.info.LSK,
          callback: ({ success, error }) => {
            nextStep({
              success,
              ...(success ? {
                illustration: 'secondPassphraseSuccess',
                title: t('2nd passphrase registration submitted'),
                message: t('You will be notified when your transaction is confirmed.'),
              } : {
                illustration: 'secondPassphraseError',
                title: t('2nd passphrase registration failed'),
                message: t('There was an error on the transaction.'),
                error,
              }),
            });
          },
        });
      },
    }}
    cancelButton={{
      label: t('Go back'),
      onClick: prevStep,
    }}
    fee={fromRawLsk(Fees.setSecondPassphrase)}
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
