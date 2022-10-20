import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import ProgressBar from '../RegisterMultisigView/ProgressBar';
import styles from './styles.css';

const Summary = ({
  t,
  prevStep,
  nextStep,
  multisigGroupRegistered,
  formProps,
  transactionJSON,
}) => {
  const onConfirmAction = {
    label: t('Sign'),
    onClick: () => {
      nextStep({
        formProps,
        transactionJSON,
        actionFunction: multisigGroupRegistered,
      });
    },
  };

  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ formProps, transactionJSON }); },
  };

  return (
    <section className={styles.wrapper}>
      <TransactionSummary
        hasCancel
        className={styles.container}
        confirmButton={onConfirmAction}
        cancelButton={onCancelAction}
        formProps={formProps}
        transactionJSON={transactionJSON}
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
