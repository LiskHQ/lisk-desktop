/* eslint-disable complexity */
import React, { useEffect } from 'react';
import { getErrorReportMailto, isEmpty } from 'src/utils/helpers';
import { TertiaryButton, PrimaryButton } from 'src/theme/buttons';
import routes from 'src/routes/routes';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import Illustration from 'src/modules/common/components/illustration';
import getIllustration from '../TxBroadcaster/illustrationsMap';
import styles from './Regular.css';

const errorTypes = [txStatusTypes.signatureError, txStatusTypes.broadcastError];

const successTypes = [
  txStatusTypes.multisigSignaturePartialSuccess,
  txStatusTypes.multisigSignatureSuccess,
  txStatusTypes.multisigBroadcastSuccess,
  txStatusTypes.broadcastSuccess,
];

const Regular = ({
  transactions,
  network,
  account,
  noBackButton,
  title,
  message,
  t,
  status,
  history,
  children,
  illustration,
  className,
  resetTransactionResult,
  transactionBroadcasted,
  moduleCommandSchemas,
  onRetry,
}) => {
  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction) && !transactions.txSignatureError) {
      transactionBroadcasted(transactions.signedTransaction, moduleCommandSchemas);
    }

    return resetTransactionResult;
  }, []);

  const goToWallet = () => {
    history.push(routes.wallet.path);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {typeof illustration === 'string' ? (
        <Illustration name={getIllustration(status.code, illustration, account.hwInfo)} />
      ) : (
        React.cloneElement(illustration)
      )}
      <h1 className="result-box-header">{title}</h1>
      <p className="transaction-status body-message">{message}</p>
      {children}
      {successTypes.includes(status.code) && !noBackButton && (
        <PrimaryButton
          className={`${styles.backToWallet} back-to-wallet-button`}
          onClick={goToWallet}
        >
          {t('Back to wallet')}
        </PrimaryButton>
      )}
      {errorTypes.includes(status.code) ? (
        <>
          {onRetry && (
            <PrimaryButton className={`${styles.retryBtn}`} onClick={onRetry}>
              {t('Try again')}
            </PrimaryButton>
          )}
          <p>{t('Is the problem persisting?')}</p>
          <a
            className="report-error-link"
            href={getErrorReportMailto({
              error: status.message,
              errorMessage: message,
              networkIdentifier: network.networkIdentifier,
              serviceUrl: network.serviceUrl,
              liskCoreVersion: network.networkVersion,
            })}
            target="_top"
            rel="noopener noreferrer"
          >
            <TertiaryButton>{t('Report the error via email')}</TertiaryButton>
          </a>
        </>
      ) : null}
    </div>
  );
};

export default Regular;
