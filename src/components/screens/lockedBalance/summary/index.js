import React from 'react';
import { withTranslation } from 'react-i18next';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.unlockToken;

const Summary = ({
  transactionInfo,
  error,
  fee,
  prevStep,
  t,
  nextStep,
  account,
}) => {
  const onSubmit = () => {
    if (!error) {
      nextStep({ transactionInfo });
    } else {
      nextStep({ error });
    }
  };

  const onConfirmAction = {
    label: t('Confirm'),
    onClick: onSubmit,
  };
  const onCancelAction = {
    label: t('Cancel'),
    onClick: () => { prevStep(); },
  };

  return (
    <TransactionSummary
      title={t('Unlock LSK summary')}
      t={t}
      account={account}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && fee.value}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      createTransaction={(callback) => {
        callback(transactionInfo);
      }}
    >
      <TransactionInfo
        moduleAssetId={moduleAssetId}
        transaction={transactionInfo}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default withTranslation()(Summary);
