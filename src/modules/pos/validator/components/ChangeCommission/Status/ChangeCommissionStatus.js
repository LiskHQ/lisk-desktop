import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCommandSchema } from '@network/hooks';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus, isTxStatusError } from '@transaction/configuration/statusConfig';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import statusMessages from './statusMessages';
import styles from './ChangeCommissionStatus.css';

const ChangeCommissionStatus = ({ transactions, account, history, prevStep }) => {
  const { t } = useTranslation();
  const { moduleCommandSchemas } = useCommandSchema();
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const isBroadcastError = isTxStatusError(status.code);

  const onSuccessClick = async () => {
    removeSearchParamsFromUrl(history, ['modal']);
  };

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TxBroadcaster
        illustration="default"
        status={status}
        title={template.title}
        message={template.message}
        className={styles.content}
        successButtonText={t('Continue to validator profile')}
        onSuccessClick={onSuccessClick}
        onRetry={isBroadcastError ? () => prevStep({ step: 0 }) : undefined}
      />
    </div>
  );
};

export default ChangeCommissionStatus;
