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
  t,
}) => {
  const amount = fromRawLsk(rawTx.asset.amount);
  const onConfirmAction = {
    label: t('Send {{amount}} {{token}}', { amount, token }),
    onClick: () => {
      nextStep({
        rawTx,
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
    />
  );
};

export default Summary;
