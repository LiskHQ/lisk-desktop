import React from 'react';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import { getErrorReportMailto } from '../../utils/helpers';
import styles from './transactionResult.css';
import Illustration from '../toolbox/illustration';

const TransactionResult = ({
  success, title, message, primaryButon, t, error, children, illustration,
}) => (
  <div className={styles.wrapper}>
    {
      typeof illustration === 'string'
      ? <Illustration name={illustration} />
      : React.cloneElement(illustration)
    }
    <h1 className='result-box-header'>{title}</h1>
    <p className='transaction-status body-message'>{message}</p>
    {children}
    <PrimaryButtonV2 onClick={primaryButon.onClick}
      className={`${styles.button} ${primaryButon.className}`}>
      {primaryButon.title}
    </PrimaryButtonV2>
    {
      !success
      ? <React.Fragment>
          <p>{t('Does the problem still persist?')}</p>
          <a className='report-error-link'
            href={getErrorReportMailto(error)}
            target='_top'
            rel='noopener noreferrer'>
            <TertiaryButtonV2>
              {t('Report the error via E-Mail')}
            </TertiaryButtonV2>
          </a>
        </React.Fragment>
      : null
    }
  </div>
);

export default TransactionResult;

