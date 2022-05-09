import React from 'react';
import { tokenMap } from '@token/fungible/consts/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import TransactionSummary from '@transaction/components/TransactionSummary';
import TransactionInfo from '@transaction/components/TransactionInfo';
import styles from './summary.css';

const Summary = ({
  balanceReclaimed,
  nextStep,
  account,
  network,
  t,
}) => {
  const [
    selectedPriority,, priorityOptions,
  ] = useTransactionPriority(tokenMap.LSK.key);

  const { minFee } = useTransactionFeeCalculation({
    network,
    selectedPriority,
    token: tokenMap.LSK.key,
    wallet: account.info.LSK,
    priorityOptions,
    transaction: {
      moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
      nonce: account.info.LSK.sequence.nonce,
      senderPublicKey: account.info.LSK.summary.publicKey,
      amount: account.info.LSK.legacy.balance,
    },
  });

  const onSubmit = () => {
    nextStep({
      rawTransaction: {
        fee: minFee,
      },
      actionFunction: balanceReclaimed,
    });
  };

  console.log(">>>> ", TransactionSummary);

  return (
    <TransactionSummary
      title={t('Transaction summary')}
      confirmButton={{
        label: t('Continue'),
        onClick: onSubmit,
      }}
      fee={minFee.value}
      classNames={styles.container}
    >
      <TransactionInfo
        account={account}
        moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.reclaimLSK}
      />
    </TransactionSummary>
  );
};

export default Summary;
