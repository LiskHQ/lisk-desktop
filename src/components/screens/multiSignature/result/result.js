import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';
import CopyToClipboard from '../../../toolbox/copyToClipboard';
import Icon from '../../../toolbox/icon';

import ProgressBar from '../progressBar';
import styles from './styles.css';

const successMessage = t => ({
  illustration: 'registerMultisignatureSuccess',
  message: t('You have successfully signed the transaction. You can download or copy the transaction and share it with members.'),
});

const errorMessage = t => ({
  illustration: 'registerMultisignatureError',
  message: t('Oops, looks like something went wrong.'),
});

const Result = ({
  t, transaction, error,
}) => {
  const [tx, setTx] = useState({
    json: '',
    uri: '',
  });

  useEffect(() => {
    setTx({
      json: JSON.stringify(transaction),
      uri: encodeURIComponent(JSON.stringify(transaction)),
      name: `tx-${transaction.moduleID}-${transaction.assetID}`,
    });
  }, []);

  const template = error ? errorMessage(t) : successMessage(t);

  return (
    <section className={`${styles.wrapper} transaction-status`}>
      <div className={styles.header}>
        <h1>{t('Register multisignature account')}</h1>
      </div>
      <ProgressBar current={4} />
      <TransactionResult
        t={t}
        illustration={template.illustration}
        success={!error}
        message={template.message}
        className={styles.content}
        error={tx.json}
      >
        {!error && (
          <div className={styles.buttonsContainer}>
            <CopyToClipboard
              Container={SecondaryButton}
              text={t('Copy')}
              value={tx.json}
            />
            <PrimaryButton>
              <a
                href={`data:text/json;charset=utf-8,${tx.uri}`}
                download={`${tx.name}.json`}
                className={styles.primary}
              >
                <Icon name="download" />
                {t('Download')}
              </a>
            </PrimaryButton>
            </div>
        )}
      </TransactionResult>
    </section>
  );
};

export default Result;
