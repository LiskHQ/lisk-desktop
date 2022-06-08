import React from 'react';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import TransactionSummary from '@transaction/manager/transactionSummary';

const Summary = ({
  resetTransactionResult,
  transactionCreated,
  prevStep,
  nextStep,
  fields,
  token,
  rawTx,
  t,
}) => {
  const signTransaction = () => {
    nextStep({
      rawTransaction: {
        amount: `${toRawLsk(fields.amount.value)}`,
        data: fields.reference?.value ?? '',
        recipientAddress: fields.recipient.address,
        fee: toRawLsk(parseFloat(fields.fee.value)),
      },
      actionFunction: transactionCreated,
    });
  };

  const goBack = () => {
    resetTransactionResult();
    prevStep({ fields });
  };

  // const transaction = {
  //   nonce: account.sequence.nonce,
  //   fee: toRawLsk(parseFloat(fields.fee.value)),
  //   asset: {
  //     amount: toRawLsk(fields.amount.value),
  //     data: fields.reference?.value ?? '',
  //   },
  // };
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
