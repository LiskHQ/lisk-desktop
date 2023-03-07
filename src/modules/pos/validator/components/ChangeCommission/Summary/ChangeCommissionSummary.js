import React from 'react';
import { useTranslation } from 'react-i18next';

import TransactionSummary from '@transaction/manager/transactionSummary';
import styles from './ChangeCommissionSummary.css';

const ChangeCommissionSummary = ({
  validatorRegistered,
  formProps,
  transactionJSON,
  prevStep,
  nextStep,
  selectedPriority,
  fees,
}) => {
  const { t } = useTranslation();
  const onConfirmAction = {
    label: t('Confirm'),
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
      title={t('Transaction summary')}
      subtitle={t('Please review and verify the transaction details before signing.')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      className={`${styles.box} ${styles.summaryContainer}`}
      formProps={formProps}
      transactionJSON={transactionJSON}
      selectedPriority={selectedPriority}
      width="full"
      fees={fees}
    />
  );
};

export default ChangeCommissionSummary;
