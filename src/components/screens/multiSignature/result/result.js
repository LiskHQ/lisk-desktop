import React, { useState } from 'react';
import { downloadJSON, transactionToJSON } from '@utils/transaction';
import copyToClipboard from 'copy-to-clipboard';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import { TransactionResult, getBroadcastStatus } from '@shared/transactionResult';
import Icon from '@toolbox/icon';
import statusMessages from './statusMessages';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const Result = ({
  t, transactions, error, transaction,
}) => {
  const [copied, setCopied] = useState(false);

  const onDownload = () => {
    downloadJSON(transaction, `tx-${transactions.signedTransaction.id}`);
  };

  const onCopy = () => {
    copyToClipboard(transactionToJSON(transaction));
    setCopied(true);
  };

  const status = getBroadcastStatus(transactions, false); // @todo handle HW errors by #3661
  const template = statusMessages(t)[status.code];

  return (
    <section className={`${styles.wrapper} transaction-status`}>
      <div className={styles.header}>
        <h1>{t('Register multisignature account')}</h1>
      </div>
      <ProgressBar current={4} />
      <TransactionResult
        t={t}
        illustration="registerMultisignature"
        status={status}
        message={template}
        className={styles.content}
      >
        {!error ? (
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
        ) : null}
      </TransactionResult>
    </section>
  );
};

export default Result;
