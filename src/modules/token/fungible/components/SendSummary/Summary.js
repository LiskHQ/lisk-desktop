import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';

const Summary = ({
  resetTransactionResult,
  tokensTransferred,
  prevStep,
  nextStep,
  formProps,
  transactionJSON,
  selectedPriority,
  fees,
  t,
}) => {
  const onConfirmAction = {
    label: t('Send'),
    onClick: (modifiedTransactionJSON) => {
      /* istanbul ignore next */
      nextStep({
        formProps,
        transactionJSON: modifiedTransactionJSON || transactionJSON,
        selectedPriority,
        actionFunction: tokensTransferred,
      });
    },
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => {
      resetTransactionResult();
      prevStep({ formProps });
    },
  };

  return (
    <TransactionSummary
      title={t('Transaction Summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      formProps={formProps}
      transactionJSON={transactionJSON}
      selectedPriority={selectedPriority}
      fees={fees}
    />
  );
};

export default Summary;
