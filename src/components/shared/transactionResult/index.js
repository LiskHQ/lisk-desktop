/* eslint-disable complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import { getErrorReportMailto, isEmpty } from '@utils/helpers';
import { transactionToJSON } from '@utils/transaction';
import { TertiaryButton } from '@toolbox/buttons';
import Illustration from '@toolbox/illustration';
import { selectActiveTokenNetwork } from '@store/selectors';
import styles from './transactionResult.css';

const illustrations = {
  default: {
    pending: 'transactionPending',
    success: 'transactionSuccess',
    error: 'transactionError',
  },
  vote: {
    pending: 'votingSuccess',
    success: 'votingSuccess',
    error: 'transactionError',
  },
  registerMultisignature: {
    pending: 'registerMultisignatureSuccess',
    success: 'registerMultisignatureSuccess',
    error: 'registerMultisignatureError',
  },
  signMultisignature: {
    SIGN_SUCCEEDED: 'registerMultisignatureSuccess',
    SIGN_FAILED: 'registerMultisignatureError',
    BROADCASTED: 'transactionSuccess',
    BROADCAST_FAILED: 'transactionError',
    PENDING: 'registerMultisignatureSuccess',
  },
};

const errorTypes = ['SIGN_FAILED', 'BROADCAST_FAILED', 'error'];

/**
 * Defines the status of the broadcasted tx.
 *
 * @param {Object} transactions - Transactions status from the redux store
 * @param {*} isHardwareWalletError ??
 * @returns {Object} The status code and message
 */
export const getBroadcastStatus = (transactions, isHardwareWalletError) => {
  if (!isEmpty(transactions.signedTransaction)) {
    return { code: 'pending' };
  }
  if (!transactions.txBroadcastError && !isHardwareWalletError) {
    return { code: 'success' };
  }
  return { code: 'error', message: transactionToJSON(transactions.txBroadcastError) };
};

export const TransactionResult = ({
  title, message, t, status, children, illustration, className,
}) => {
  const network = useSelector(selectActiveTokenNetwork);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {
        typeof illustration === 'string'
          ? <Illustration name={illustrations[illustration][status.code]} />
          : React.cloneElement(illustration)
      }
      <h1 className="result-box-header">{title}</h1>
      <p className="transaction-status body-message">{message}</p>
      {children}
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

export default TransactionResult;
