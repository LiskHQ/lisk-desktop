import React from 'react';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import TransactionSummary from '@transaction/manager/transactionSummary';

const Summary = ({
  resetTransactionResult,
  tokensTransferred,
  prevStep,
  nextStep,
  fields,
  token,
  rawTx,
  t,
}) => {
  const signTransaction = () => {
    nextStep({
      rawTx,
      actionFunction: tokensTransferred,
    });
  };

  const goBack = () => {
    resetTransactionResult();
    prevStep({ fields });
  };

  const amount = fromRawLsk(rawTx.asset.amount);
  return (
    <TransactionSummary
      title={t('Transaction summary')}
      confirmButton={{
        label: t('Send {{amount}} {{token}}', { amount, token }),
        onClick: signTransaction,
      }}
      cancelButton={{
        label: t('Edit transaction'),
        onClick: goBack,
      }}
      rawTx={rawTx}
    />
  );
};

export default Summary;
