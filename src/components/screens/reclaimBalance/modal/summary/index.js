import React from 'react';
import to from 'await-to-js';
import { useSelector } from 'react-redux';
import { selectAccount } from '@store/selectors';
import { create } from '@api/transaction';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { useTransactionFeeCalculation, useTransactionPriority } from '@shared/transactionPriority';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import { toRawLsk } from '@utils/lsk';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.reclaimLSK;

const Summary = ({
  nextStep,
  t,
}) => {
  const account = useSelector(selectAccount);
  const network = useSelector(state => state.network);
  const senderPublicKey = account.info.LSK.summary.publicKey;
  const [
    // eslint-disable-next-line no-unused-vars
    selectedPriority, _, priorityOptions,
  ] = useTransactionPriority(tokenMap.LSK.key);

  const { minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token: tokenMap.LSK.key,
    account: account.info.LSK,
    priorityOptions,
    transaction: {
      moduleAssetId,
      nonce: account.info.LSK.sequence.nonce,
      senderPublicKey,
      amount: account.info.LSK.legacy.balance,
    },
  });

  const onSubmit = async () => {
    const data = {
      network,
      account: account.info.LSK,
      transactionObject: {
        moduleAssetId,
        fee: toRawLsk(minFee.value),
        amount: account.info.LSK.legacy.balance,
        keys: { numberOfSignatures: 0 },
      },
    };

    const [error, tx] = await to(
      create(data, tokenMap.LSK.key),
    );

    if (!error) {
      nextStep({ transactionInfo: tx, balance: account.info.LSK.legacy?.balance });
    } else {
      nextStep({ transactionError: error, balance: account.info.LSK.legacy?.balance });
    }
  };

  const onConfirmAction = {
    label: t('Continue'),
    onClick: onSubmit,
  };

  return (
    <TransactionSummary
      title={t('Transaction summary')}
      t={t}
      account={account.info.LSK}
      confirmButton={onConfirmAction}
      showCancelButton={false}
      fee={minFee.value}
      token={tokenMap.LSK.key}
      classNames={styles.summaryContainer}
    >
      <TransactionInfo account={account} moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.reclaimLSK} />
    </TransactionSummary>
  );
};

export default Summary;
