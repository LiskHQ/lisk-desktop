import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import BoxFooter from '@toolbox/box/footer';
import copyToClipboard from 'copy-to-clipboard';
import Icon from '@toolbox/icon';
import { downloadJSON } from '@utils/helpers';
import styles from './transactionSummary.css';

const Footer = ({
  confirmButton, cancelButton, footerClassName,
  isMultisignature, t, createTransaction,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const onDownload = (transaction) => {
    console.log('onDownload 1');
    if (!downloaded) {
      console.log('onDownload 2');
      downloadJSON(transaction, `tx-${transaction.moduleID}-${transaction.assetID}`);
      setDownloaded(true);
    }
  };

  const onCopy = (transaction) => {
    copyToClipboard(JSON.stringify(transaction));
    setCopied(true);
  };

  return (
    <BoxFooter className={`${footerClassName} summary-footer`} direction="horizontal">
      {isMultisignature ? (
        <>
          <SecondaryButton
            className="cancel-button"
            onClick={cancelButton.onClick}
          >
            {t('Cancel')}
          </SecondaryButton>
          <SecondaryButton
            className="copy-button"
            onClick={() => {
              createTransaction(onCopy);
            }}
          >
            <span className={styles.buttonContent}>
              <Icon name={copied ? 'checkmark' : 'copy'} />
              {t(copied ? 'Copied' : 'Copy')}
            </span>
          </SecondaryButton>
          <PrimaryButton
            className="download-button"
            onClick={() => {
              createTransaction(onDownload);
            }}
          >
            <span className={styles.buttonContent}>
              <Icon name="download" />
              {t('Download')}
            </span>
          </PrimaryButton>
        </>
      ) : (
        <>
          {typeof cancelButton.onClick === 'function' && (
            <SecondaryButton
              className="cancel-button"
              onClick={cancelButton.onClick}
            >
              {cancelButton.label}
            </SecondaryButton>
          )}
          <PrimaryButton
            className="confirm-button"
            disabled={confirmButton.disabled}
            onClick={confirmButton.onClick}
          >
            {confirmButton.label}
          </PrimaryButton>
        </>
      )}
    </BoxFooter>
  );
};

export default Footer;
