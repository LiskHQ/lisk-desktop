import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import { fromRawLsk } from '@utils/lsk';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerDelegate;

const Summary = ({
  account,
  nickname,
  prevStep,
  t,
  nextStep,
  transactionInfo,
  error,
}) => {
  const onSubmit = () => {
    if (!error) {
      nextStep({ transactionInfo });
    } else {
      nextStep({ error });
    }
  };

  const onConfirmAction = {
    label: t('Become a delegate'),
    onClick: onSubmit,
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ nickname }); },
  };

  return (
    <TransactionSummary
      title={t('Summary of delegate registration')}
      t={t}
      account={account}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && fromRawLsk(transactionInfo.fee)}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      createTransaction={(callback) => {
        callback(transactionInfo);
      }}
    >
      <TransactionInfo
        nickname={nickname}
        moduleAssetId={moduleAssetId}
        transaction={transactionInfo}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
