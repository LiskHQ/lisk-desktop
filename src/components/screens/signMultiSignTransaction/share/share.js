import React from 'react';
import { downloadJSON } from '@utils/helpers';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import CopyToClipboard from '@toolbox/copyToClipboard';
import Icon from '@toolbox/icon';
import TransactionResult from '@shared/transactionResult';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const getTemplate = (t, error, isBroadcasted) => {
  if (error) {
    return {
      illustration: 'registerMultisignatureError',
      message: t(`Error: ${error}`),
    };
  }

  if (!error) {
    if (isBroadcasted) {
      return {
        illustration: 'registerMultisignatureSuccess',
        message: t('You have successfully sent the transaction. You can download or copy the transaction and send it back to the initiator.'),
      };
    }
    return {
      illustration: 'registerMultisignatureSuccess',
      message: t('You have successfully signed the transaction. You can download or copy the transaction and send it back to the initiator.'),
    };
  }

  return {
    illustration: 'registerMultisignatureError',
    message: t('Error: Unknown error'),
  };
};

const Share = ({
  t, transaction, error, isBroadcasted = false,
}) => {
  const success = !error && transaction;
  const template = getTemplate(t, error, isBroadcasted);

  const onDownload = () => {
    downloadJSON(transaction, transaction.id);
  };

  console.log(transaction);
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
        {success && (
          <BoxFooter className={styles.footer} direction="horizontal">
            <CopyToClipboard
              Container={SecondaryButton}
              text={t('Copy')}
              className={styles.buttonContent}
              value={JSON.stringify(transaction)}
            />
            <PrimaryButton onClick={onDownload}>
              <span className={styles.buttonContent}>
                <Icon name="download" />
                {t('Download')}
              </span>
            </PrimaryButton>
          </BoxFooter>
        )}
      </Box>
    </section>
  );
};

export default Share;
