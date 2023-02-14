import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import styles from './RegisterValidatorSummary.css';

const RegisterValidatorSummary = ({
  validatorRegistered,
  formProps,
  transactionJSON,
  prevStep,
  nextStep,
  t,
  selectedPriority,
  fees,
}) => {
  const onConfirmAction = {
    label: t('Register validator'),
    className: styles.actionBtn,
    onClick: () => {
      nextStep({
        formProps,
        transactionJSON,
        actionFunction: validatorRegistered,
      });
    },
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => {
      prevStep({ formProps, transactionJSON });
    },
  };

  return (
    <TransactionSummary
      title={t('Register validator summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      className={`${styles.box} ${styles.summaryContainer}`}
      formProps={formProps}
      transactionJSON={transactionJSON}
      selectedPriority={selectedPriority}
      fees={fees}
    />
  );
};

export default RegisterValidatorSummary;
