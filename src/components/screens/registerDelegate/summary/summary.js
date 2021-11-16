import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import { fromRawLsk } from '@utils/lsk';
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

  return (
    <TransactionSummary
      title={t('Delegate registration summary')}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && fromRawLsk(rawTransaction.fee)}
      classNames={`${styles.box} ${styles.summaryContainer}`}
    >
      <TransactionInfo
        nickname={rawTransaction.username}
        moduleAssetId={moduleAssetId}
        transaction={rawTransaction}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
