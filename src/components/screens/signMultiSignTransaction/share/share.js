import React, { useEffect, useState } from 'react';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import CopyToClipboard from '@toolbox/copyToClipboard';
import Icon from '@toolbox/icon';
import TransactionResult from '@shared/transactionResult';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const successMessage = t => ({
  illustration: 'registerMultisignatureSuccess',
  message: t('You have successfully signed the transaction. You can download or copy the transaction and send it back to the initiator.'),
});

const errorMessage = (t, error) => ({
  illustration: 'registerMultisignatureError',
  message: t('Error: {{error}}', { error }),
});

const Share = ({
  t, transactionInfo, error,
}) => {
  const [tx, setTx] = useState({
    json: '',
    uri: '',
  });
  const success = !error && transactionInfo;
  const template = success ? successMessage(t) : errorMessage(t, error);

  useEffect(() => {
    setTx({
      json: JSON.stringify(transactionInfo),
      uri: encodeURIComponent(JSON.stringify(transactionInfo)),
      name: transactionInfo.id,
    });
  }, []);

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Register multisignature account')}</h1>
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={4} />
          <TransactionResult
            t={t}
            illustration={template.illustration}
            success={success}
            message={template.message}
            className={styles.content}
            error={error}
          />
        </BoxContent>
        {/* TODO use TransactionSummary */}
        {success && (
          <BoxFooter className={styles.footer} direction="horizontal">
            <CopyToClipboard
              Container={SecondaryButton}
              text={t('Copy')}
              className={styles.buttonContent}
              value={tx.json}
            />
            <PrimaryButton>
              <a
                href={`data:text/json;charset=utf-8,${tx.uri}`}
                download={`${tx.name}.json`}
                className={`${styles.buttonContent} ${styles.primary}`}
              >
                <Icon name="download" />
                {t('Download')}
              </a>
            </PrimaryButton>
          </BoxFooter>
        )}
      </Box>
    </section>
  );
};

export default Share;
