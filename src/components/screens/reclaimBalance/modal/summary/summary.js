import React, { useEffect } from 'react';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { isEmpty } from '@utils/helpers';
import { useTransactionFeeCalculation, useTransactionPriority } from '@shared/transactionPriority';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import styles from './summary.css';

const Summary = ({
  signedTransaction,
  txSignatureError,
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
    account: account.info.LSK,
    priorityOptions,
    transaction: {
      moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
      nonce: account.info.LSK.sequence.nonce,
      senderPublicKey: account.info.LSK.summary.publicKey,
      amount: account.info.LSK.legacy.balance,
    },
  });

  // eslint-disable-next-line max-statements
  const onSubmit = () => {
    balanceReclaimed({ fee: minFee });
  };

  useEffect(() => {
    // success
    if (!isEmpty(signedTransaction)) {
      nextStep({
        transactionInfo: signedTransaction,
        balance: account.info.LSK.legacy?.balance,
      });
    }
  }, [signedTransaction]);

  useEffect(() => {
    // error
    if (txSignatureError) {
      nextStep({
        transactionError: txSignatureError,
        balance: account.info.LSK.legacy?.balance,
      });
    }
  }, [txSignatureError]);

  return (
    <TransactionSummary
      title={t('Transaction summary')}
      confirmButton={{
        label: t('Continue'),
        onClick: onSubmit,
      }}
      fee={minFee.value}
      classNames={styles.summaryContainer}
    >
      <TransactionInfo account={account} moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.reclaimLSK} />
    </TransactionSummary>
  );
};

export default Summary;
