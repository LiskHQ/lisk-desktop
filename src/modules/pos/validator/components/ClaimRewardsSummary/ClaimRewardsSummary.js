import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import styles from './claimRewardsSummary.css';

const ClaimRewardsSummary = ({
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
      title={t('Transaction summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!wallet.summary.isMultisignature && transactionJSON.fee}
      className={`${styles.summaryContainer}`}
      selectedPriority={selectedPriority}
      formProps={formProps}
      transactionJSON={transactionJSON}
    />
  );
};

export default ClaimRewardsSummary;
