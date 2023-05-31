import React, { useEffect } from 'react';
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
import { selectModuleCommandSchemas } from 'src/redux/selectors';
import { isEmpty } from 'src/utils/helpers';

import styles from './status.css';

const shouldShowBookmark = (bookmarks, account, transactionJSON, token) => {
  if (account.summary.address === transactionJSON.params.recipientAddress) {
    return false;
  }

  return !bookmarks[token].find(
    (bookmark) => bookmark.address === transactionJSON.params.recipientAddress
  );
};

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
  recipientAccount,
  transactions,
  bookmarks,
  account,
  token,
  transactionJSON,
  t,
  formProps,
  prevStep,
}) => {
  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction) && !transactions.txSignatureError) {
      /**
       * Retrieve recipient info to use for bookmarking
       */
      recipientAccount.loadData({ address: transactionJSON.params.recipientAddress });
    }
  }, []);

  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);

  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = getMessagesDetails(transactions, status, t);

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
                label: recipientAccount.data.pos?.validator?.username ?? '',
                isValidator: !!recipientAccount.data.summary?.isValidator,
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
