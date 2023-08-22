import React, { useState, useEffect, useRef } from 'react';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { cryptography } from '@liskhq/lisk-client';
import Illustration from 'src/modules/common/components/illustration';
import routes from 'src/routes/routes';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { getErrorReportMailto } from 'src/utils/helpers';

import copyToClipboard from 'copy-to-clipboard';
import { toTransactionJSON, downloadJSON, joinModuleAndCommand } from '@transaction/utils';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import Icon from 'src/theme/Icon';
import getIllustration from '../TxBroadcaster/illustrationsMap';
import styles from './Multisignature.css';

export const PartiallySignedActions = ({ onDownload, t }) => (
  <PrimaryButton className={`${styles.download} download-button`} onClick={onDownload}>
    <span className={styles.buttonContent}>
      <Icon name="download" />
      {t('Download')}
    </span>
  </PrimaryButton>
);

export const FullySignedActions = ({ t, onDownload, onSend }) => (
  <>
    <SecondaryButton
      className={`${styles.download} ${styles.secondary} download-button`}
      onClick={onDownload}
    >
      <span className={styles.buttonContent}>
        <Icon name="download" />
        {t('Download')}
      </span>
    </SecondaryButton>
    <PrimaryButton className={`${styles.download} send-button`} onClick={onSend}>
      <span className={styles.buttonContent}>{t('Send')}</span>
    </PrimaryButton>
  </>
);

const ErrorActions = ({ t, status, message, network, application }) => (
  <a
    className="report-error-link"
    href={getErrorReportMailto({
      error: status?.message,
      errorMessage: message,
      networkIdentifier: network.networkIdentifier,
      serviceUrl: network.serviceUrl,
      liskCoreVersion: network.networkVersion,
      application,
    })}
    target="_top"
    rel="noopener noreferrer"
  >
    <SecondaryButton>{t('Report the error via email')}</SecondaryButton>
  </a>
);

// eslint-disable-next-line max-statements
const Multisignature = ({
  transactions,
  title,
  message,
  t,
  status,
  className,
  history,
  noBackButton,
  resetTransactionResult,
  transactionBroadcasted,
  network,
  moduleCommandSchemas,
  application,
}) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef();
  const moduleCommand = joinModuleAndCommand(transactions.signedTransaction);
  const paramSchema = moduleCommandSchemas[moduleCommand];
  const transactionJSON = toTransactionJSON(transactions.signedTransaction, paramSchema);

  const onCopy = () => {
    setCopied(true);
    copyToClipboard(JSON.stringify(transactionJSON));
    ref.current = setTimeout(() => setCopied(false), 1000);
  };

  const onDownload = () => {
    const filePrefix =
      moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature
        ? 'register-multisignature-request'
        : 'sign-multisignature-request';
    const senderAddress = cryptography.address.getLisk32AddressFromPublicKey(
      transactions.signedTransaction?.senderPublicKey
    );

    const fileSuffix = transactionJSON?.id !== '' ? transactionJSON?.id : `-${senderAddress}`;
    downloadJSON(transactionJSON, `${filePrefix}-${fileSuffix}`);
  };

  const onSend = () => {
    transactionBroadcasted(transactions.signedTransaction, moduleCommandSchemas);
  };

  const goToWallet = () => {
    history.push(routes.wallet.path);
  };

  useEffect(() => resetTransactionResult, []);

  useEffect(() => () => clearTimeout(ref.current), []);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Illustration name={getIllustration(status.code, 'signMultisignature')} />
      <h6 className="result-box-header">{title}</h6>
      <p className="transaction-status body-message">{message}</p>

      <div className={styles.primaryActions}>
        {status.code === txStatusTypes.broadcastSuccess && !noBackButton ? (
          <PrimaryButton
            className={`${styles.backToWallet} back-to-wallet-button`}
            onClick={goToWallet}
          >
            {t('Back to wallet')}
          </PrimaryButton>
        ) : null}
        {status.code === txStatusTypes.broadcastError ? (
          <ErrorActions
            message={message}
            network={network}
            status={status}
            t={t}
            application={application}
          />
        ) : null}
        {status.code !== txStatusTypes.broadcastSuccess &&
        status.code !== txStatusTypes.broadcastError ? (
          <SecondaryButton className={`${styles.copy} copy-button`} onClick={onCopy}>
            <span className={styles.buttonContent}>
              <Icon name={copied ? 'transactionStatusSuccessful' : 'copy'} />
              {t(copied ? 'Copied' : 'Copy')}
            </span>
          </SecondaryButton>
        ) : null}
        {status.code === txStatusTypes.multisigSignatureSuccess ? (
          <FullySignedActions onDownload={onDownload} t={t} onSend={onSend} />
        ) : null}
        {status.code === txStatusTypes.multisigSignaturePartialSuccess ? (
          <PartiallySignedActions onDownload={onDownload} t={t} />
        ) : null}
      </div>
    </div>
  );
};

export default Multisignature;
