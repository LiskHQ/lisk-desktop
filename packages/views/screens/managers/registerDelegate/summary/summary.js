import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@common/configuration';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import { toRawLsk } from '@token/utilities/lsk';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerDelegate;

const Summary = ({
  delegateRegistered,
  rawTransaction,
  account,
  prevStep,
  nextStep,
  t,
}) => {
  const onSubmit = () => {
    nextStep({
      rawTransaction,
      actionFunction: delegateRegistered,
    });
  };

  const onConfirmAction = {
    label: t('Register delegate'),
    onClick: onSubmit,
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ username: rawTransaction.username }); },
  };

  const transaction = {
    fee: toRawLsk(rawTransaction.fee.value),
    nonce: account.sequence.nonce,
    username: rawTransaction.username,
  };

  return (
    <TransactionSummary
      title={t('Delegate registration summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && rawTransaction.fee.value}
      classNames={`${styles.box} ${styles.summaryContainer}`}
    >
      <TransactionInfo
        username={rawTransaction.username}
        moduleAssetId={moduleAssetId}
        transaction={transaction}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
