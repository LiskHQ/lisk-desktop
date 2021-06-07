import React, { useState } from 'react';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import styles from './styles.css';

export const CopyFooter = ({
  t,
  onCopy,
  copied,
  onDownload,
}) => (
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
);

export const CopyAndSendFooter = ({
  t,
  onSend,
  onCopy,
  copied,
  onDownload,
}) => {
  const [sent, setSent] = useState(false);

  const onClick = (e) => {
    setSent(true);
    onSend(e);
  };

  return (
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
      <SecondaryButton onClick={onDownload}>
        <span className={`${styles.buttonContent} ${styles.download}`}>
          <Icon name="download" />
          {t('Download')}
        </span>
      </SecondaryButton>
      <PrimaryButton
        onClick={onClick}
        disabled={sent}
        className="send-button"
      >
        <span className={styles.buttonContent}>
          {t('Send')}
        </span>
      </PrimaryButton>
    </BoxFooter>
  );
};
