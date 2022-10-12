import React from 'react';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import TransactionSummary from '@transaction/manager/transactionSummary';

const Summary = ({
  resetTransactionResult,
  tokensTransferred,
  prevStep,
  nextStep,
  token,
  rawTx,
  selectedPriority,
  fees,
  t,
}) => {
  const amount = fromRawLsk(rawTx.params.amount);
  const onConfirmAction = {
    label: t('Send {{amount}} {{token}}', { amount, token }),
    onClick: () => {
      nextStep({
        rawTx,
        selectedPriority,
        actionFunction: tokensTransferred,
      });
    },
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => {
      resetTransactionResult();
      prevStep({ rawTx });
    },
  };

  return (
    <TransactionSummary
      title={t('Transaction Summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      rawTx={rawTx}
      selectedPriority={selectedPriority}
      fees={fees}
    />
  );
};

export default Summary;
