import React from 'react';
import { useTranslation } from 'react-i18next';

import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import statusMessages from './statusMessages';
import styles from './ChangeCommissionStatus.css';

const ChangeCommissionStatus = ({ transactions, account, history }) => {
  const { t } = useTranslation();
  const status = getTransactionStatus(account, transactions, account.summary.isMultisignature);
  const template = statusMessages(t)[status.code];

  const onSuccessClick = () => {
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
      />
    </div>
  );
};

export default ChangeCommissionStatus;
