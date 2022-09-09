import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import ProgressBar from '../RegisterMultisigView/ProgressBar';
import styles from './styles.css';

const Summary = ({ t, prevStep, nextStep, multisigGroupRegistered, rawTx }) => {
  const onConfirmAction = {
    label: t('Sign'),
    onClick: () => {
      nextStep({
        rawTx,
        actionFunction: multisigGroupRegistered,
      });
    },
  };

  const onCancelAction = {
    label: t('Go back'),
    onClick: () => {
      prevStep({ rawTx });
    },
  };

  return (
    <section className={styles.wrapper}>
      <TransactionSummary
        hasCancel
        className={styles.container}
        confirmButton={onConfirmAction}
        cancelButton={onCancelAction}
        rawTx={rawTx}
      >
        <div className={styles.header}>
          <h1>{t('Register multisignature account')}</h1>
        </div>
        <ProgressBar current={2} />
      </TransactionSummary>
    </section>
  );
};

export default Summary;
