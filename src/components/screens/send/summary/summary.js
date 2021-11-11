import React, { useState, useEffect } from 'react';
import { loginTypes, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { toRawLsk, fromRawLsk } from '@utils/lsk';
import { isEmpty } from '@utils/helpers';
import Piwik from '@utils/piwik';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';

const Summary = ({
  transactionDoubleSigned,
  resetTransactionResult,
  transactionCreated,
  isInitialization,
  transactions,
  prevStep,
  nextStep,
  account,
  fields,
  token,
  t,
}) => {
  const [secondPass, setSecondPass] = useState('');

  useEffect(() => {
    transactionCreated({
      amount: `${toRawLsk(fields.amount.value)}`,
      data: fields.reference ? fields.reference.value : '',
      recipientAddress: fields.recipient.address,
      fee: toRawLsk(parseFloat(fields.fee.value)),
    });
  }, []);

  useEffect(() => {
    if (secondPass) {
      transactionDoubleSigned({ secondPass });
    }
  }, [secondPass]);

  const submitTransaction = (fn) => {
    if (!account.summary.isMultisignature || secondPass) {
      Piwik.trackingEvent('Send_SubmitTransaction', 'button', 'Next step');
      if (account.loginType !== loginTypes.passphrase.code
          && transactions.txSignatureError) {
        nextStep({
          fields: {
            ...fields,
            hwTransactionStatus: 'error',
          },
        });
      }

      if (!isEmpty(transactions.signedTransaction)
        && !transactions.txSignatureError) {
        nextStep({
          fields: {
            ...fields,
            hwTransactionStatus: false,
          },
        });
      }
    } else {
      fn(transactions.signedTransaction);
    }
  };

  const goBack = () => {
    Piwik.trackingEvent('Send_Summary', 'button', 'Previous step');
    resetTransactionResult();
    prevStep({ fields });
  };

  const transaction = transactions.signedTransaction;
  const amount = transaction?.asset?.amount
    ? fromRawLsk(transaction?.asset?.amount) : fields.amount.value;

  return (
    <TransactionSummary
      title={t('Transaction summary')}
      t={t}
      account={account}
      confirmButton={{
        label: isInitialization ? t('Send') : t('Send {{amount}} {{token}}', { amount, token }),
        onClick: submitTransaction,
      }}
      cancelButton={{
        label: t('Edit transaction'),
        onClick: goBack,
      }}
      showCancelButton={!isInitialization}
      fee={!account.summary.isMultisignature && fields.fee.value}
      token={token}
      createTransaction={submitTransaction}
      keys={account.keys}
      setSecondPass={setSecondPass}
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
