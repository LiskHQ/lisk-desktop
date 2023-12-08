import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectModuleCommandSchemas } from 'src/redux/selectors';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus, isTxStatusError } from '@transaction/configuration/statusConfig';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { useQueryClient } from '@tanstack/react-query';
import { INVOKE } from 'src/const/queries';
import statusMessages from './statusMessages';
import styles from './ChangeCommissionStatus.css';

const ChangeCommissionStatus = ({ transactions, account, history, prevStep }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const isBroadcastError = isTxStatusError(status.code);

  /* istanbul ignore next */
  const onSuccessClick = async () => {
    await queryClient.invalidateQueries(INVOKE);
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
