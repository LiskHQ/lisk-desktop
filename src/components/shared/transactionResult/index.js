/* eslint-disable complexity */
import React from 'react';
import { getErrorReportMailto } from '@utils/helpers';
import { TertiaryButton } from '@toolbox/buttons';
import Illustration from '@toolbox/illustration';
import styles from './transactionResult.css';

const TransactionResult = ({
  success, title, message, t, error, children, illustration, className, sharedData,
}) => {
  if (sharedData) {
    illustration = sharedData.illustration;
    title = sharedData.title;
    message = sharedData.message;
    success = sharedData.success;
  }
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {
      typeof illustration === 'string'
        ? <Illustration name={illustration} />
        : React.cloneElement(illustration)
    }
      <h1 className="result-box-header">{title}</h1>
      <p className="transaction-status body-message">{message}</p>
      {children}
      {
      !success
        ? (
          <>
            <p>{t('Does the problem still persist?')}</p>
            <a
              className="report-error-link"
              href={getErrorReportMailto(error)}
              target="_top"
              rel="noopener noreferrer"
            >
              <TertiaryButton>
                {t('Report the error via E-Mail')}
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
