import React from 'react';
import { useSelector } from 'react-redux';

import { txStatusTypes } from '@transaction/configuration/txStatus';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import {
  getTransactionStatus,
  isTxStatusError,
  statusMessages,
} from '@transaction/configuration/statusConfig';
import { PrimaryButton } from '@theme/buttons';
import DialogLink from '@theme/dialog/link';
import { useValidators } from '@pos/validator/hooks/queries';
import { selectModuleCommandSchemas } from 'src/redux/selectors';
import { shouldShowBookmark } from 'src/modules/common/constants';
import styles from './status.css';

const getMessagesDetails = (transactions, status, t) => {
  const messages = statusMessages(t);
  const code = status.code;
  const messageDetails = messages[code];

  if (code === txStatusTypes.broadcastError && transactions.txBroadcastError?.error?.message) {
    messageDetails.message = transactions.txBroadcastError.error.message;
  }

  return messageDetails;
};

const TransactionStatus = ({
  transactions,
  bookmarks,
  account,
  token,
  transactionJSON,
  t,
  formProps,
  prevStep,
}) => {
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = getMessagesDetails(transactions, status, t);
  const { data: validators } = useValidators({
    config: { params: { address: transactionJSON.params.recipientAddress } },
  });
  const validator = validators?.data?.[0];

  const isBroadcastError = isTxStatusError(status.code);
  const showBookmark =
    !isBroadcastError && shouldShowBookmark(bookmarks, account, transactionJSON, token);

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TxBroadcaster
        title={template.title}
        illustration="default"
        message={template.message}
        status={status}
        formProps={formProps}
        onRetry={isBroadcastError ? () => prevStep({ step: 0 }) : undefined}
      >
        {showBookmark ? (
          <div className={`${styles.bookmarkBtn} bookmark-container`}>
            <DialogLink
              component="addBookmark"
              data={{
                formAddress: transactionJSON.params.recipientAddress,
                label: validator?.name ?? '',
                isValidator: !!validator,
              }}
            >
              <PrimaryButton className={`${styles.btn} bookmark-btn`}>
                {t('Add address to bookmarks')}
              </PrimaryButton>
            </DialogLink>
          </div>
        ) : null}
      </TxBroadcaster>
    </div>
  );
};

export default TransactionStatus;
