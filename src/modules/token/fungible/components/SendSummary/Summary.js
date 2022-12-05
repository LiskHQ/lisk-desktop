import React from 'react';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import TransactionSummary from '@transaction/manager/transactionSummary';

const Summary = ({
  resetTransactionResult,
  tokensTransferred,
  prevStep,
  nextStep,
  token,
  formProps,
  transactionJSON,
  selectedPriority,
  fees,
  t,
}) => {
  const amount = fromRawLsk(transactionJSON.params.amount);
  const onConfirmAction = {
    label: t('Send {{amount}} {{token}}', { amount, token }),
    onClick: () => {
      nextStep({
        formProps,
        transactionJSON,
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
