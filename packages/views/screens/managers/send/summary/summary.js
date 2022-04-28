import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { toRawLsk } from '@token/utilities/lsk';
import TransactionSummary from '@transaction/components/transactionSummary';
import TransactionInfo from '@transaction/components/transactionInfo';

const Summary = ({
  resetTransactionResult,
  transactionCreated,
  prevStep,
  nextStep,
  account,
  fields,
  token,
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

  const transaction = {
    nonce: account.sequence.nonce,
    fee: toRawLsk(parseFloat(fields.fee.value)),
    asset: {
      amount: toRawLsk(fields.amount.value),
      data: fields.reference?.value ?? '',
    },
  };
  const amount = fields.amount.value;

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
      fee={!account.summary.isMultisignature && fields.fee.value}
    >
      <TransactionInfo
        fields={fields}
        token={token}
        moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.transfer}
        transaction={transaction}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
