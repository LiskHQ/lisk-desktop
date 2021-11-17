import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { toRawLsk, fromRawLsk } from '@utils/lsk';
import { isEmpty } from '@utils/helpers';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';

const Summary = ({
  resetTransactionResult,
  transactionCreated,
  transactions,
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
        data: fields.reference ? fields.reference.value : '',
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

  const transaction = transactions.signedTransaction;
  const amount = transaction?.asset?.amount
    ? fromRawLsk(transaction?.asset?.amount) : fields.amount.value;

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
        transaction={
          !isEmpty(transaction)
            ? transaction
            : { asset: { amount: toRawLsk(fields.amount.value) } }
        }
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
