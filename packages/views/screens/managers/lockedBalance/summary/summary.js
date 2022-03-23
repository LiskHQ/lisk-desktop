import React from 'react';

import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import TransactionSummary from '@shared/transactionSummary';
import { fromRawLsk } from '@token/utilities/lsk';
import { getUnlockableUnlockObjects } from '@wallet/utilities/account';
import TransactionInfo from '@shared/transactionInfo';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.unlockToken;

const Summary = ({
  currentBlockHeight,
  balanceUnlocked,
  rawTransaction,
  prevStep,
  nextStep,
  account,
  t,
}) => {
  const transaction = {
    nonce: account.sequence.nonce,
    fee: fromRawLsk(rawTransaction.selectedFee),
    asset: {
      unlockObjects: getUnlockableUnlockObjects(
        account.dpos?.unlocking, currentBlockHeight,
      ),
    },
  };

  const onSubmit = () => {
    nextStep({
      rawTransaction,
      actionFunction: balanceUnlocked,
    });
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
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && rawTransaction.selectedFee.value}
      classNames={`${styles.box} ${styles.summaryContainer}`}
    >
      <TransactionInfo
        moduleAssetId={moduleAssetId}
        transaction={transaction}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
