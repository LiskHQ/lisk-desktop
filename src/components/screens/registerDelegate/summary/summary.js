import React, { useState } from 'react';
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
  const [secondPass, setSecondPass] = useState('');
  const onSubmit = () => {
    if (!error) {
      nextStep({ transactionInfo });
    } else {
      nextStep({ error });
    }
  };

  const onConfirmAction = {
    label: t('Register delegate'),
    onClick: onSubmit,
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ nickname }); },
  };

  return (
    <TransactionSummary
      title={t('Delegate registration summary')}
      t={t}
      account={account}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && fromRawLsk(transactionInfo.fee)}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      createTransaction={(callback) => {
        callback(transactionInfo);
      }}
      keys={account.keys}
      setSecondPass={setSecondPass}
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
