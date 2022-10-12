import React from 'react';
import { tokenMap } from '@token/fungible/consts/tokens';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import TransactionSummary from '@transaction/manager/transactionSummary';
import { toRawLsk } from '@token/fungible/utils/lsk';
import styles from './summary.css';

const transaction = {
  moduleCommand: MODULE_COMMANDS_NAME_MAP.reclaim,
  params: {},
};

const Summary = ({
  balanceReclaimed,
  nextStep,
  prevStep,
  wallet,
  network,
  t,
  fees,
}) => {
  transaction.nonce = wallet.sequence.nonce;
  transaction.sender = { PublicKey: wallet.summary.publicKey };
  transaction.params.amount = wallet.legacy.balance;

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
    composedFees: {
      Transaction: toRawLsk(minFee.value),
      initiation: toRawLsk('0.05'),
    },
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
      hasCancel
      className={styles.container}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      rawTx={rawTx}
      selectedPriority={selectedPriority}
      fees={fees}
    />
  );
};

Summary.whyDidYouRender = true;

// istanbul ignore next
const areEqual = (prevProps, nextProps) => ( // @todo account has multiple balance now
  prevProps.wallet.summary.balance === nextProps.wallet.summary.balance
);

export default React.memo(Summary, areEqual);
