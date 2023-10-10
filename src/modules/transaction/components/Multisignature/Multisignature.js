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
import { useAccounts, useCurrentAccount } from '@account/hooks';
import { calculateRemainingAndSignedMembers, truncateAddress } from '@wallet/utils/account';
import { ReactComponent as SwitchIcon } from '@setup/react/assets/images/icons/switch-icon.svg';
import WarningNotification from '@common/components/warningNotification';
import AccountRow from '@account/components/AccountRow';
import classNames from 'classnames';
import { useAuth } from '@auth/hooks/queries';
import { immutableArrayMerge } from 'src/utils/immutableUtils';
import getIllustration from '../TxBroadcaster/illustrationsMap';
import styles from './Multisignature.css';

export const PartiallySignedActions = ({
  onDownload,
  nextAccountToSign,
  t,
  transactionJSON,
  reset,
}) => {
  const [, setCurrentAccount] = useCurrentAccount();

  const handleSwitchAccount = () => {
    const stringifiedTransaction = encodeURIComponent(JSON.stringify(transactionJSON));
    setCurrentAccount(
      nextAccountToSign,
      `/wallet?modal=signMultiSignTransaction&stringifiedTransaction=${stringifiedTransaction}`,
      true,
      { stringifiedTransaction }
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
}) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef();
  const { accounts } = useAccounts();
  const moduleCommand = joinModuleAndCommand(transactions.signedTransaction);
  const paramSchema = moduleCommandSchemas[moduleCommand];
  const transactionJSON = toTransactionJSON(transactions.signedTransaction, paramSchema);

  const originatorAccount = accounts.find(
    (account) => account.metadata.pubkey === transactionJSON.senderPublicKey
  );

  const { data: authData } = useAuth({
    config: { params: { address: originatorAccount?.metadata?.address } },
    options: { enabled: !!originatorAccount?.metadata?.address },
  });

  const isRegisterMultisignature =
    transactionJSON.params?.mandatoryKeys?.length !== transactionJSON.signatures?.length &&
    joinModuleAndCommand(transactionJSON) === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

  const { remaining } = calculateRemainingAndSignedMembers(
    isRegisterMultisignature
      ? {
          optionalKeys: transactionJSON.params.optionalKeys,
          mandatoryKeys: [
            ...new Set(
              immutableArrayMerge(
                transactionJSON.params.mandatoryKeys,
                authData?.data?.mandatoryKeys
              )
            ),
          ],
        }
      : { mandatoryKeys: authData?.data?.mandatoryKeys },
    transactionJSON,
    isRegisterMultisignature
  );

  const nextAccountToSign = accounts.find((account) =>
    remaining.some((remainingAccount) => account.metadata.address === remainingAccount.address)
  );

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
      {nextAccountToSign && (
        <div className={styles.requiredAccountSection}>
          <WarningNotification
            isVisible
            message={
              <span>
                {t('A required signatory account')}{' '}
                <b>
                  ({nextAccountToSign?.metadata?.name} -
                  {truncateAddress(nextAccountToSign?.metadata?.address)})
                </b>{' '}
                {t(
                  'to complete this transaction has been found on your Lisk Desktop. Please click on “Switch account” to complete this transaction.'
                )}
              </span>
            }
          />
          <h4 className={styles.requiredAccountTitle}>{t('Required account')}</h4>
          <AccountRow className={classNames(styles.accountRow)} account={nextAccountToSign} />
        </div>
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
        !nextAccountToSign ? (
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
          <PartiallySignedActions
            onDownload={onDownload}
            nextAccountToSign={nextAccountToSign}
            t={t}
            transactionJSON={transactionJSON}
            reset={reset}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Multisignature;
