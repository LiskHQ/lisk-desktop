import React, { useState } from 'react';
import { downloadJSON, transactionToJSON } from '@utils/transaction';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import TransactionResult from '@shared/transactionResult';

import copyToClipboard from 'copy-to-clipboard';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const getTemplate = (t, error, isBroadcasted) => {
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
    message: t(`Error: ${error}`),
  };
};

const Share = ({
  t, transaction, error, isBroadcasted = false,
}) => {
  const success = !error && transaction;
  const template = getTemplate(t, error, isBroadcasted);

  const [copied, setCopied] = useState(false);

  const onDownload = () => {
    downloadJSON(transaction, `tx-${transaction.moduleID}-${transaction.assetID}`);
  };

  const onCopy = () => {
    copyToClipboard(transactionToJSON(transaction));
    setCopied(true);
  };

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
