import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';
import CopyToClipboard from '../../../toolbox/copyToClipboard';
import Icon from '../../../toolbox/icon';

import ProgressBar from '../progressBar';
import styles from './styles.css';

const Result = ({
  t, transaction, error, transactions, transactionBroadcasted,
}) => {
  const [status, setStatus] = useState(!error ? 'pending' : 'fail');
  const success = status !== 'fail';

  const template = success ? {
    illustration: 'registerMultisignatureSuccess',
    message: t('You have successfully signed the transaction. You can download or copy the transaction and share it with members.'),
  } : {
    illustration: 'registerMultisignatureError',
    message: t('Oops, looks like something went wrong.'),
  };

  useEffect(() => {
    if (transaction) {
      // if (transaction.signatures.filter(signature => signature.length > 0).length === numberOfSignatures) {

      // } else {
      //   nextStep({ transaction });
      // }
      // const confirmed = transactions.confirmed
      //   .filter(tx => tx.id === transaction.id);
      // const broadcastError = transactions.broadcastedTransactionsError
      //   .filter(tx => tx.transaction.id === transaction.id);

      // if (confirmed.length) setStatus('ok');
      // if (broadcastError.length) setStatus('fail');
    }
  }, [transactions]);

  useEffect(() => {
    if (transaction) transactionBroadcasted(transaction);
  }, [transaction]);

  return (
    <section className={`${styles.wrapper} transaction-status`}>
      <div className={styles.header}>
        <h1>{t('Register multisignature account')}</h1>
      </div>
      <ProgressBar current={4} />
      <TransactionResult
        t={t}
        illustration={template.illustration}
        success={success}
        message={template.message}
        className={styles.content}
        error={JSON.stringify(error)}
      >
        {success && (
          <div className={styles.buttonsContainer}>
            <CopyToClipboard
              Container={SecondaryButton}
              text={t('Copy')}
            />
            <PrimaryButton>
              <span>
                <Icon name="download" />
                {t('Download')}
              </span>
            </PrimaryButton>
            </div>
        )}
      </TransactionResult>
    </section>
  );
};

export default Result;
