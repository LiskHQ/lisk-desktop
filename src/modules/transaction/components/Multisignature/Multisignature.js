import React, { useEffect, useRef, useState } from 'react';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { cryptography } from '@liskhq/lisk-client';
import Illustration from 'src/modules/common/components/illustration';
import routes from 'src/routes/routes';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { getErrorReportMailto } from 'src/utils/helpers';

import copyToClipboard from 'copy-to-clipboard';
import { downloadJSON, joinModuleAndCommand, toTransactionJSON } from '@transaction/utils';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import Icon from 'src/theme/Icon';
import { useCurrentAccount } from '@account/hooks';
import { ReactComponent as SwitchIcon } from '@setup/react/assets/images/icons/switch-icon.svg';
import generateUniqueId from 'src/utils/generateUniqueId';
import { NextAccountToSign } from 'src/modules/transaction/components/NextAccountToSign';
import { useNextAccountToSign } from '@transaction/components/NextAccountToSign/utils';
import { useTranslation } from 'react-i18next';
import { useSession } from '@libs/wcm/hooks/useSession';
import { requestSuccessData } from '@wallet/components/RequestSignStatus';
import getIllustration from '../TxBroadcaster/illustrationsMap';
import styles from './Multisignature.css';

export const PartiallySignedActions = ({
  onDownload,
  nextAccountToSign,
  t,
  transactionJSON,
  reset,
  isWalletConnectRequest,
}) => {
  const [currentAccount, setCurrentAccount] = useCurrentAccount();

  const handleSwitchAccount = () => {
    const stringifiedTransaction = encodeURIComponent(JSON.stringify(transactionJSON));
    const uniqueUrlIdToPreventHashError = generateUniqueId();
    setCurrentAccount(
      nextAccountToSign,
      `/wallet?modal=signMultiSignTransaction&prevAccount=${currentAccount.metadata.address}&uniqueId=${uniqueUrlIdToPreventHashError}&requestViewWalletConnect=${isWalletConnectRequest}`,
      true,
      {
        stringifiedTransaction,
      }
    );
    reset?.();
  };

  const DownloadButton = nextAccountToSign ? SecondaryButton : PrimaryButton;

  return (
    <>
      <DownloadButton className={`${styles.download} download-button`} onClick={onDownload}>
        <span className={styles.buttonContent}>
          {nextAccountToSign ? <Icon name="downloadBlue" /> : <Icon name="download" />}
          {t('Download')}
        </span>
      </DownloadButton>
      {nextAccountToSign && (
        <PrimaryButton
          className={`${styles.switchAccountBtn} download-button`}
          onClick={handleSwitchAccount}
        >
          <span className={styles.buttonContent}>
            <SwitchIcon />
            {t('Switch Account')}
          </span>
        </PrimaryButton>
      )}
    </>
  );
};

export const FullySignedActions = ({ t, onDownload, onSend, isWalletConnectRequest }) => {
  const { sessionRequest } = useSession();

  return (
    <>
      {!isWalletConnectRequest ? (
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
      ) : (
        <a href={sessionRequest.peer.metadata.url} target="_blank" rel="noopener noreferrer">
          <PrimaryButton>{t('Return to application')}</PrimaryButton>
        </a>
      )}
    </>
  );
};

export const ErrorActions = ({ t, status, message, network, application }) => (
  <a
    className="report-error-link"
    href={getErrorReportMailto({
      error: status?.message,
      errorMessage: message,
      networkIdentifier: network?.networkIdentifier,
      serviceUrl: network?.serviceUrl,
      liskCoreVersion: network?.networkVersion,
      application,
    })}
    target="_top"
    rel="noopener noreferrer"
  >
    <SecondaryButton>{t('Report the error via email')}</SecondaryButton>
  </a>
);

function CopyButton({ transactionJSON, transactions, isWalletConnectRequest }) {
  const ref = useRef();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { respond } = useSession();

  const onCopy = () => {
    setCopied(true);
    if (isWalletConnectRequest) {
      const signatures = transactions.signedTransaction?.signatures.map((sig) =>
        sig.toString('hex')
      );
      const payload = JSON.stringify(signatures);
      copyToClipboard(payload);
      // inform to the application
      respond({ payload });
    } else {
      copyToClipboard(JSON.stringify(transactionJSON));
    }
    ref.current = setTimeout(() => setCopied(false), 1000);
  };

  useEffect(() => () => clearTimeout(ref.current), []);

  return (
    <SecondaryButton className={`${styles.copy} copy-button`} onClick={onCopy}>
      <span className={styles.buttonContent}>
        <Icon name={copied ? 'transactionStatusSuccessful' : 'copy'} />
        {t(copied ? 'Copied' : 'Copy')}
      </span>
    </SecondaryButton>
  );
}

// eslint-disable-next-line max-statements, complexity
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
  reset,
  location,
}) => {
  const isWalletConnectRequest = location.search?.includes('request');
  const moduleCommand = joinModuleAndCommand(transactions.signedTransaction);
  const paramSchema = moduleCommandSchemas[moduleCommand];
  const transactionJSON = toTransactionJSON(transactions.signedTransaction, paramSchema);

  const { nextAccountToSign } = useNextAccountToSign({ transactionJSON });

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

  const successMultiOrWalletConnectMessage = !isWalletConnectRequest
    ? message
    : requestSuccessData(t).description;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Illustration name={getIllustration(status.code, 'signMultisignature')} />
      <h6 className="result-box-header">{title}</h6>
      {!nextAccountToSign && (
        <p className="transaction-status body-message">{successMultiOrWalletConnectMessage}</p>
      )}
      {nextAccountToSign && status.code !== txStatusTypes.multisigSignatureSuccess && (
        <NextAccountToSign nextAccountToSign={nextAccountToSign} />
      )}
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
          status.code !== txStatusTypes.broadcastError &&
          !nextAccountToSign && (
            <CopyButton
              transactionJSON={transactionJSON}
              transactions={transactions}
              isWalletConnectRequest={isWalletConnectRequest}
            />
          )}
        {status.code === txStatusTypes.multisigSignatureSuccess && (
          <FullySignedActions
            onDownload={onDownload}
            t={t}
            onSend={onSend}
            isWalletConnectRequest={isWalletConnectRequest}
          />
        )}
        {status.code === txStatusTypes.multisigSignaturePartialSuccess && (
          <PartiallySignedActions
            onDownload={onDownload}
            nextAccountToSign={nextAccountToSign}
            t={t}
            transactionJSON={transactionJSON}
            reset={reset}
            isWalletConnectRequest={isWalletConnectRequest}
          />
        )}
      </div>
    </div>
  );
};

export default Multisignature;
