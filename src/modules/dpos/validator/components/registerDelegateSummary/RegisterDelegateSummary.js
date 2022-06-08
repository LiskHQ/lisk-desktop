import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import styles from './registerDelegateSummary.css';

const RegisterDelegateSummary = ({
  delegateRegistered,
  rawTx,
  account,
  prevStep,
  nextStep,
  t,
}) => {
  const onSubmit = () => {
    nextStep({
      rawTx,
      actionFunction: delegateRegistered,
    });
  };

  const onConfirmAction = {
    label: t('Register delegate'),
    onClick: onSubmit,
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ username: rawTx.asset.username }); },
  };

  return (
    <TransactionSummary
      title={t('Delegate registration summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && rawTx.fee.value}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      isMultisignature={account.summary.isMultisignature}
      rawTx={rawTx}
    />
  );
};

export default RegisterDelegateSummary;
