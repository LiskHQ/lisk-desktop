import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import styles from './registerDelegateSummary.css';

const RegisterDelegateSummary = ({
  delegateRegistered,
  formProps,
  transactionJSON,
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
        formProps,
        transactionJSON,
        actionFunction: delegateRegistered,
      });
    },
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ formProps, transactionJSON, }); },
  };

  return (
    <TransactionSummary
      title={t('Delegate registration Summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      formProps={formProps}
      transactionJSON={transactionJSON}
      selectedPriority={selectedPriority}
      fees={fees}
    />
  );
};

export default RegisterDelegateSummary;
