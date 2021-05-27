import React, { useEffect, useState, useRef } from 'react';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import BoxFooter from '@toolbox/box/footer';
import copyToClipboard from 'copy-to-clipboard';
import Icon from '@toolbox/icon';
import styles from './transactionSummary.css';

const Footer = ({
  confirmButton, cancelButton, footerClassName,
  isMultisignature, t, createTransaction,
}) => {
  const timeoutRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [tx, setTx] = useState({
    json: '',
    uri: '',
    name: '',
  });

  const onCopy = () => {
    copyToClipboard(tx.json);
    setCopied(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  useEffect(() => {
    createTransaction((res) => {
      setTx({
        json: JSON.stringify(res),
        uri: encodeURIComponent(JSON.stringify(res)),
        name: `tx-${res.moduleID}-${res.assetID}`,
      });
    });

    return () => clearTimeout(timeoutRef.current);
  }, []);

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
            onClick={onCopy}
          >
            <span className={styles.buttonContent}>
              <Icon name={copied ? 'checkmark' : 'copy'} />
              {t(copied ? 'Copied' : 'Copy')}
            </span>
          </SecondaryButton>
          <PrimaryButton
            className="download-button"
          >
            <a
              className={`${styles.buttonContent} ${styles.primary}`}
              href={`data:text/json;charset=utf-8,${tx.uri}`}
              download={`${tx.name}.json`}
            >
              <Icon name="download" />
              {t('Download')}
            </a>
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

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.footerClassName === nextProps.footerClassName
  && prevProps.isMultisignature === nextProps.isMultisignature
  && (
    (!prevProps.confirmButton.disabled && !nextProps.confirmButton.disabled)
    || (prevProps.confirmButton.disabled === nextProps.confirmButton.disabled)
  ));

export default React.memo(Footer, areEqual);
