import React from 'react';
import { useCommandSchema } from '@network/hooks';
import { PrimaryButton } from 'src/theme/buttons';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import {
  getTransactionStatus,
  isTxStatusError,
  statusMessages,
} from '@transaction/configuration/statusConfig';

const TransactionStatus = ({ account, transactions, t, prevStep }) => {
  const { moduleCommandSchemas } = useCommandSchema();
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
