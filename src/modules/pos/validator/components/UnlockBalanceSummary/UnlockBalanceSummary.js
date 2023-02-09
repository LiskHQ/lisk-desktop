import React from 'react';

import TransactionSummary from '@transaction/manager/transactionSummary';
import styles from './unlockBalanceSummary.css';

const UnlockBalanceSummary = ({
  balanceUnlocked,
  selectedPriority,
  formProps,
  transactionJSON,
  prevStep,
  nextStep,
  wallet,
  t,
}) => {
  const onConfirmAction = {
    label: t('Confirm'),
    onClick: () => {
      nextStep({
        formProps,
        transactionJSON,
        actionFunction: balanceUnlocked,
      });
    },
  };
  const onCancelAction = {
    label: t('Cancel'),
    onClick: () => {
      prevStep();
    },
  };

  return (
    <TransactionSummary
      title={t('Unlock Summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!wallet.summary.isMultisignature && transactionJSON.fee}
      className={`${styles.box} ${styles.summaryContainer}`}
      selectedPriority={selectedPriority}
      formProps={formProps}
      transactionJSON={transactionJSON}
    />
  );
};

export default UnlockBalanceSummary;
