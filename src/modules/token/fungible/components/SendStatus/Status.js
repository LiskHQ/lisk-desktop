import React, { useEffect } from 'react';
import { isEmpty } from 'src/utils/helpers';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { PrimaryButton } from 'src/theme/buttons';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import {
  getTransactionStatus,
  statusMessages,
} from '@transaction/configuration/statusConfig';
import DialogLink from 'src/theme/dialog/link';
import styles from './status.css';

const shouldShowBookmark = (bookmarks, account, rawTx, token) => {
  if (account.summary.address === rawTx.params.recipient.address) {
    return false;
  }
  return !bookmarks[token].find(
    (bookmark) => bookmark.address === rawTx.params.recipient.address,
  );
};

const getMessagesDetails = (transactions, status, t, isHardwareWalletError) => {
  const messages = statusMessages(t);
  const code = isHardwareWalletError ? txStatusTypes.hwRejected : status.code;
  const messageDetails = messages[code];

  if (
    status.code === txStatusTypes.broadcastError
    && transactions.txBroadcastError?.error?.message
  ) {
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
  rawTx,
  t,
}) => {
  useEffect(() => {
    if (
      !isEmpty(transactions.signedTransaction)
      && !transactions.txSignatureError
    ) {
      /**
       * Retrieve recipient info to use for bookmarking
       */
      recipientAccount.loadData({ address: rawTx.recipientAddress });
    }
  }, []);

  const showBookmark = shouldShowBookmark(
    bookmarks,
    account,
    rawTx,
    token,
  );
  const status = getTransactionStatus(
    account,
    transactions,
    account.summary.isMultisignature,
  );
  const template = getMessagesDetails(transactions, status, t, false);

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TxBroadcaster
        title={template.title}
        illustration="default"
        message={template.message}
        status={status}
      >
        {showBookmark ? (
          <div className={`${styles.bookmarkBtn} bookmark-container`}>
            <DialogLink
              component="addBookmark"
              data={{
                formAddress: rawTx.params.recipient.address,
                label: recipientAccount.data.dpos?.delegate?.username ?? '',
                isDelegate: !!recipientAccount.data.summary?.isDelegate,
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
