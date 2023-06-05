import React from 'react';
import { useSelector } from 'react-redux';

import { PrimaryButton } from 'src/theme/buttons';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import {
  getTransactionStatus,
  isTxStatusError,
  statusMessages,
} from '@transaction/configuration/statusConfig';
import { selectModuleCommandSchemas } from 'src/redux/selectors';

const TransactionStatus = ({ account, transactions, t, prevStep }) => {
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const isBroadcastError = isTxStatusError(status.code);

  return (
    <div className="transaction-status">
      <TxBroadcaster
        illustration="default"
        status={status}
        title={template.title}
        message={template.message}
        onRetry={isBroadcastError ? () => prevStep({ step: 0 }) : undefined}
      >
        {template.button && (
          <PrimaryButton
            onClick={template.button.onClick}
            className={`${template.button.className} dialog-close-button`}
          >
            {template.button.title}
          </PrimaryButton>
        )}
      </TxBroadcaster>
    </div>
  );
};

export default TransactionStatus;
