import React, { useState } from 'react';
import to from 'await-to-js';

import { create } from '@api/transaction';
import { toRawLsk } from '@utils/lsk';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerDelegate;

const Summary = ({
  account,
  nickname,
  prevStep,
  fee,
  t,
  nextStep,
  network,
}) => {
  const [transaction, setTransaction] = useState(undefined);
  const createTransaction = async () => {
    const data = {
      moduleAssetId,
      network,
      senderPublicKey: account.summary.publicKey,
      passphrase: account.passphrase,
      nonce: account.sequence?.nonce,
      fee: toRawLsk(parseFloat(fee)),
      username: nickname,
    };

    const [error, tx] = await to(
      create(data, tokenMap.LSK.key),
    );
    if (tx) {
      setTransaction(tx);
    }
    return [error, tx];
  };

  const onSubmit = async () => {
    const [error, tx] = await createTransaction();

    if (!error) {
      nextStep({ transactionInfo: tx });
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
      fee={fee}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      createTransaction={createTransaction}
      transaction={transaction}
    >
      <TransactionInfo
        account={account}
        nickname={nickname}
        moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.registerDelegate}
      />
    </TransactionSummary>
  );
};

export default Summary;
