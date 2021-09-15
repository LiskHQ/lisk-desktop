import React, { useState } from 'react';
import { useTheme } from '@utils/theme';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import { routes } from '@constants';
import Icon from '@toolbox/icon';
import styles from './styles.css';

export const CopyFooter = ({
  t,
  onCopy,
  copied,
  onDownload,
  prevStep,
}) => {
  const theme = useTheme();
  return (
    <BoxFooter className={styles.footer} direction="horizontal">
      <SecondaryButton
        className={`go-back-button ${theme === 'dark' && 'dark'}`}
        onClick={prevStep}
      >
        <span className={styles.buttonContent}>
          {t('Go back')}
        </span>
      </SecondaryButton>
      <SecondaryButton
        className={`copy-button ${theme === 'dark' && 'dark'}`}
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
};

export const CopyAndSendFooter = ({
  t,
  onSend,
  onCopy,
  copied,
  onDownload,
  history,
  prevStep,
}) => {
  const [sent, setSent] = useState(false);

  const onClick = (e) => {
    setSent(true);
    onSend(e);
  };

  const closeModal = () => {
    history.push(routes.wallet.path);
  };

  return (
    <BoxFooter className={styles.footer} direction="horizontal">
      <SecondaryButton
        className="go-back-button"
        onClick={prevStep}
      >
        <span className={styles.buttonContent}>
          {t('Go back')}
        </span>
      </SecondaryButton>
      {
        !sent ? (
          <>
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
              className="send-button"
            >
              <span className={styles.buttonContent}>
                {t('Send')}
              </span>
            </PrimaryButton>
          </>
        ) : (
          <PrimaryButton
            onClick={closeModal}
            className="send-button"
          >
            <span className={styles.buttonContent}>
              {t('Back to wallet')}
            </span>
          </PrimaryButton>
        )
      }
    </BoxFooter>
  );
};
