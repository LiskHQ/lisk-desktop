import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import styles from './registerDelegateSummary.css';

const RegisterDelegateSummary = ({
  delegateRegistered,
  rawTx,
  prevStep,
  nextStep,
  t,
  selectedPriority,
  fees,
}) => {
  const onConfirmAction = {
    label: t('Register delegate'),
    onClick: () => {
      nextStep({
        rawTx,
        actionFunction: delegateRegistered,
      });
    },
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ rawTx }); },
  };

  return (
    <TransactionSummary
      title={t('Delegate registration Summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      rawTx={rawTx}
      selectedPriority={selectedPriority}
      fees={fees}
    />
  );
};

export default RegisterDelegateSummary;
