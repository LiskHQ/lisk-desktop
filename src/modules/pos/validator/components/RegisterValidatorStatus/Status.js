import React from 'react';
import { useSelector } from 'react-redux';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus, isTxStatusError } from '@transaction/configuration/statusConfig';
import { selectModuleCommandSchemas } from 'src/redux/selectors';
import statusMessages from './statusMessages';
import styles from './Status.css';

const RegisterValidatorStatus = ({ transactions, account, t, prevStep }) => {
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const isBroadcastError = isTxStatusError(status.code);

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TxBroadcaster
        illustration="registerValidator"
        status={status}
        title={template.title}
        message={template.message}
        className={styles.content}
        onRetry={isBroadcastError ? () => prevStep({ step: 0 }) : undefined}
      />
    </div>
  );
};

export default RegisterValidatorStatus;
