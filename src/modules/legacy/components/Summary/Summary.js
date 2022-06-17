import React from 'react';
import { tokenMap } from '@token/fungible/consts/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import TransactionSummary from '@transaction/manager/transactionSummary';
import { toRawLsk } from '@token/fungible/utils/lsk';
import styles from './summary.css';

const transaction = {
  moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
  asset: {},
};

const Summary = ({
  balanceReclaimed,
  nextStep,
  prevStep,
  wallet,
  network,
  t,
}) => {
  transaction.nonce = wallet.sequence.nonce;
  transaction.sender = { PublicKey: wallet.summary.publicKey };
  transaction.asset.amount = wallet.legacy.balance;

  const [
    selectedPriority,, priorityOptions,
  ] = useTransactionPriority();
  const { minFee } = useTransactionFeeCalculation({
    network,
    selectedPriority,
    token: tokenMap.LSK.key,
    wallet,
    priorityOptions,
    transaction,
  });

  const rawTx = {
    ...transaction,
    fee: toRawLsk(minFee.value),
  };

  const onSubmit = () => {
    nextStep({
      rawTx,
      actionFunction: balanceReclaimed,
    });
  };

  const onConfirmAction = {
    label: t('Continue'),
    onClick: onSubmit,
  };

  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ rawTx }); },
  };

  return (
    <TransactionSummary
      className={styles.container}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      rawTx={rawTx}
    />
  );
};

Summary.whyDidYouRender = true;

const areEqual = (prevProps, nextProps) => (
  prevProps.wallet.summary.balance === nextProps.wallet.summary.balance
);

export default React.memo(Summary, areEqual);
