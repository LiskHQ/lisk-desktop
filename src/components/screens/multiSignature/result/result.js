import React, { useState } from 'react';
import { downloadJSON, transactionToJSON } from '@utils/transaction';
import copyToClipboard from 'copy-to-clipboard';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import TransactionResult from '../../../shared/transactionResult';

import ProgressBar from '../progressBar';
import styles from './styles.css';

const Result = ({
  t, transaction, error,
}) => {
  const [copied, setCopied] = useState(false);

  const template = !error ? {
    illustration: 'registerMultisignatureSuccess',
    message: t('You have successfully signed the transaction. You can download or copy the transaction and share it with members.'),
  } : {
    illustration: 'registerMultisignatureError',
    message: t('Oops, looks like something went wrong.'),
  };

  const onDownload = () => {
    downloadJSON(transaction, `tx-${transaction.moduleID}-${transaction.assetID}`);
  };

  const onCopy = () => {
    copyToClipboard(transactionToJSON(transaction));
    setCopied(true);
  };

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
        error={JSON.stringify(error)}
      >
        {!error && (
          <div className={styles.buttonsContainer}>
            <SecondaryButton
              className="copy-button"
              onClick={onCopy}
            >
              <span className={styles.buttonContent}>
                <Icon name={copied ? 'checkmark' : 'copy'} />
                {t(copied ? 'Copied' : 'Copy')}
              </span>
            </SecondaryButton>
            <PrimaryButton onClick={onDownload}>
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
