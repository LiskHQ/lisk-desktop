// istanbul ignore file
import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@toolbox/buttons';
import { transactionToJSON, downloadJSON } from '@utils/transaction';
import PassphraseInput from '@toolbox/passphraseInput';
import BoxFooter from '@toolbox/box/footer';
import copyToClipboard from 'copy-to-clipboard';
import Icon from '@toolbox/icon';
import styles from './transactionSummary.css';

const MultisigActions = ({
  onDownload,
  onCopy,
  copied,
  t,
  cancelButton,
  createTransaction,
}) => (
  <div className={styles.primaryActions}>
    <SecondaryButton
      className="cancel-button"
      onClick={cancelButton.onClick}
    >
      {t('Go back')}
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
  </div>
);

const NormalActions = ({
  showCancelButton,
  cancelButton,
  confirmation,
  isConfirmed,
  confirmButton,
  hasSecondPass,
  secondPass,
}) => (
  <div className={styles.primaryActions}>
    {showCancelButton && (
      <SecondaryButton
        className="cancel-button"
        onClick={cancelButton.onClick}
      >
        {cancelButton.label}
      </SecondaryButton>
    )}
    <PrimaryButton
      className="confirm-button"
      disabled={
        (confirmation && !isConfirmed)
        || confirmButton.disabled
        || (hasSecondPass && !secondPass)
      }
      onClick={confirmButton.onClick}
    >
      {confirmButton.label}
    </PrimaryButton>
  </div>
);

const Footer = ({
  confirmButton, cancelButton, footerClassName, showCancelButton, hasSecondPass,
  confirmation, isConfirmed, isMultisignature, t, createTransaction, setSecondPass,
}) => {
  const [copied, setCopied] = useState(false);
  const [useSecondPass, setUseSecondPass] = useState(false);
  const [secondPassPhrase, setSecondPassPhrase] = useState('');

  const onDownload = (bufferTx = {}) => {
    const transaction = JSON.parse(transactionToJSON(bufferTx));
    downloadJSON(transaction, `tx-${transaction.id}`);
  };

  const onCopy = (transaction) => {
    copyToClipboard(transactionToJSON(transaction));
    setCopied(true);
  };

  return (
    <BoxFooter className={`${footerClassName} summary-footer`} direction="horizontal">
      {
        isMultisignature && !useSecondPass ? (
          <MultisigActions
            onDownload={onDownload}
            onCopy={onCopy}
            copied={copied}
            t={t}
            cancelButton={cancelButton}
            createTransaction={createTransaction}
          />
        ) : null
      }
      {
        hasSecondPass && !useSecondPass ? (
          <div className={styles.secondaryActions}>
            <span className={styles.or}>or</span>
            <TertiaryButton
              onClick={() => setUseSecondPass(true)}
            >
              {t('Send using second passphrase right away')}
            </TertiaryButton>
          </div>
        ) : null
      }
      {
        hasSecondPass && useSecondPass ? (
          <div className={styles.secondPassphrase}>
            <PassphraseInput
              t={t}
              onFill={(pass) => { setSecondPassPhrase(pass); setSecondPass(pass); }}
              inputsLength={12}
              maxInputsLength={24}
            />
          </div>
        ) : null
      }
      {
        !isMultisignature || (hasSecondPass && useSecondPass) ? (
          <NormalActions
            showCancelButton={showCancelButton}
            cancelButton={cancelButton}
            confirmation={confirmation}
            isConfirmed={isConfirmed}
            confirmButton={confirmButton}
            hasSecondPass={hasSecondPass}
            secondPass={secondPassPhrase}
          />
        ) : null
      }
    </BoxFooter>
  );
};

export default Footer;
