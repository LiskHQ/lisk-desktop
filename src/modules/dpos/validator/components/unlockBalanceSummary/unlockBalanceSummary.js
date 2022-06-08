import React from 'react';

import TransactionSummary from '@transaction/manager/transactionSummary';
import styles from './unlockBalanceSummary.css';

const UnlockBalanceSummary = ({
  balanceUnlocked,
  rawTx,
  prevStep,
  nextStep,
  wallet,
  t,
}) => {
  const onSubmit = () => {
    nextStep({
      rawTx,
      actionFunction: balanceUnlocked,
    });
  };

  const onConfirmAction = {
    label: t('Confirm'),
    onClick: onSubmit,
  };
  const onCancelAction = {
    label: t('Cancel'),
    onClick: () => { prevStep(); },
  };

  return (
    <TransactionSummary
      title={t('Unlock LSK summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!wallet.summary.isMultisignature && rawTx.fee}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      rawTx={rawTx}
    />
  );
};

export default UnlockBalanceSummary;
