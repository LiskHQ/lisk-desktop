import React from 'react';
import { downloadJSON } from '@utils/helpers';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';
import CopyToClipboard from '../../../toolbox/copyToClipboard';
import Icon from '../../../toolbox/icon';

import ProgressBar from '../progressBar';
import styles from './styles.css';

const Result = ({
  t, transaction, error,
}) => {
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
            <CopyToClipboard
              Container={SecondaryButton}
              text={t('Copy')}
              value={JSON.stringify(transaction)}
            />
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
