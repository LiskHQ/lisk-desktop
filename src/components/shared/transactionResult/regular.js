/* eslint-disable complexity */
import React, { useEffect } from 'react';
import { getErrorReportMailto, isEmpty } from '@utils/helpers';
import { TertiaryButton, PrimaryButton } from '@toolbox/buttons';
import { routes, txStatusTypes } from '@constants';
import Illustration from '@toolbox/illustration';
import getIllustration from './illustrations';
import styles from './transactionResult.css';

const errorTypes = [
  txStatusTypes.signatureError,
  txStatusTypes.broadcastError,
];

const successTypes = [
  txStatusTypes.multisigSignaturePartialSuccess,
  txStatusTypes.multisigSignatureSuccess,
  txStatusTypes.multisigBroadcastSuccess,
  txStatusTypes.broadcastSuccess,
];

const Regular = ({
  transactions, network, account, noBackButton,
  title, message, t, status, history,
  children, illustration, className,
  resetTransactionResult, transactionBroadcasted,
}) => {
  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction)
      && !transactions.txSignatureError) {
      transactionBroadcasted(transactions.signedTransaction);
    }

    return resetTransactionResult;
  }, []);

  const goToWallet = () => {
    history.push(routes.wallet.path);
  };

  const getReclaimError = () => {
    if (typeof message === 'string' && message.indexOf('address collision attack') > -1) {
      return (
        <p>
          <span>Read more about </span>
          <a target="_blank" href="https://lisk.com/blog/announcement/lisks-holiday-security-reminder">address collision attack</a>
          <span>.</span>
        </p>
      );
    }
    return '';
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {
        typeof illustration === 'string'
          ? <Illustration name={getIllustration(status.code, illustration, account.hwInfo)} />
          : React.cloneElement(illustration)
      }
      <h1 className="result-box-header">{title}</h1>
      <p className="transaction-status body-message">
        {message}
        {getReclaimError()}
      </p>
      {children}
      {
        successTypes.includes(status.code) && !noBackButton
          ? (
            <PrimaryButton
              className={`${styles.backToWallet} back-to-wallet-button`}
              onClick={goToWallet}
            >
              {t('Back to wallet')}
            </PrimaryButton>
          ) : null
      }
      {
        errorTypes.includes(status.code)
          ? (
            <>
              <p>{t('Does the problem still persist?')}</p>
              <a
                className="report-error-link"
                href={getErrorReportMailto(
                  {
                    error: status.message,
                    errorMessage: message,
                    networkIdentifier: network.networkIdentifier,
                    serviceUrl: network.serviceUrl,
                    liskCoreVersion: network.networkVersion,
                  },
                )}
                target="_top"
                rel="noopener noreferrer"
              >
                <TertiaryButton>
                  {t('Report the error via email')}
                </TertiaryButton>
              </a>
            </>
          )
          : null
      }
    </div>
  );
};

export default Regular;
