import React from 'react';

import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import TransactionSummary from '@transaction/manager/transactionSummary';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { getUnlockableUnlockObjects } from '@wallet/utils/account';
import TransactionInfo from '@transaction/components/TransactionInfo';
import styles from './unlockBalanceSummary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.unlockToken;

const UnlockBalanceSummary = ({
  // currentBlockHeight,
  balanceUnlocked,
  rawTx,
  prevStep,
  nextStep,
  wallet,
  t,
}) => {
  // const transaction = {
  //   nonce: wallet.sequence.nonce,
  //   fee: fromRawLsk(rawTransaction.selectedFee),
  //   asset: {
  //     unlockObjects: getUnlockableUnlockObjects(
  //       wallet.dpos?.unlocking, currentBlockHeight,
  //     ),
  //   },
  // };

  const onSubmit = () => {
    nextStep({
      rawTx,
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
      fee={!wallet.summary.isMultisignature && rawTx.fee}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      rawTx={rawTx}
      isMultisignature={wallet.summary.isMultisignature}
    />
  );
};

export default UnlockBalanceSummary;
