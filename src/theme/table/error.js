import React from 'react';
import { useTranslation } from 'react-i18next';
import Illustration from 'src/modules/common/components/illustration';
import styles from '../box/emptyState.css';
import { TertiaryButton } from '../buttons';

const Error = ({ error, handleRetry, isLoading }) => {
  const { t } = useTranslation();
  if (isLoading || !error) return null;

  return (
    <div className={`${styles.wrapper} error-state`}>
      <Illustration name="emptyWallet" />
      <h3>{typeof error === 'string' ? error : error.message}</h3>
      {handleRetry && (
        <TertiaryButton className={styles.retryBtn} onClick={handleRetry}>
          {t('Retry')}
        </TertiaryButton>
      )}
    </div>
  );
};

export default Error;
