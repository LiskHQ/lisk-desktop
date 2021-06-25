import React, { useEffect } from 'react';
import { getIndexOfBookmark } from '@utils/bookmarks';
import { isEmpty } from '@utils/helpers';
import { SecondaryButton, PrimaryButton } from '@toolbox/buttons';
import TransactionResult from '@shared/transactionResult';
import DialogLink from '@toolbox/dialog/link';
import statusMessage from './statusMessages';
import styles from './transactionStatus.css';

const bookmarkInformation = (bookmarks, fields) => {
  const isBookmarked = getIndexOfBookmark(
    bookmarks,
    { address: fields.recipient.address },
  ) !== -1;

  return {
    isBookmarked,
  };
};

const getMessagesDetails = (transactions, fields, t, isHardwareWalletConnected) => {
  const isHardwareWalletError = isHardwareWalletConnected && fields.hwTransactionStatus === 'error';
  const messages = statusMessage(t);
  let messageDetails = !transactions.txBroadcastError
    ? messages.success
    : messages.error;

  if (transactions.txBroadcastError
      && transactions.txBroadcastError.error
      && transactions.txBroadcastError.error.message) {
    messageDetails.paragraph = transactions.txBroadcastError.error.message;
  }

  if (isHardwareWalletConnected) {
    messageDetails = isHardwareWalletError ? messages.hw : messages.success;
  }

  return {
    isHardwareWalletError,
    messageDetails,
  };
};

// eslint-disable-next-line complexity
const TransactionStatus = ({
  transactionBroadcasted,
  resetTransactionResult,
  recipientAccount,
  transactions,
  bookmarks,
  prevStep,
  account,
  fields,
  t,
}) => {
  const isHardwareWalletConnected = !!(account.hwInfo && account.hwInfo.deviceId);

  const broadcast = () => {
    const { signedTransaction, txSignatureError } = transactions;

    if (!isEmpty(signedTransaction)) {
      transactionBroadcasted(signedTransaction);
    }
    // @todo Why did we do this?
    // if (txSignatureError) {
    //   txSignatureError.forEach(tx => transactionBroadcasted(tx));
    // }
  };

  const onRetry = () => {
    const { txBroadcastError } = transactions;

    if (isHardwareWalletConnected) {
      resetTransactionResult();
      prevStep({ ...fields, hwTransactionStatus: false });
    } else {
      // @todo Why do we do this?
      // transactionBroadcasted(txBroadcastError);
    }
  };

  useEffect(() => {
    recipientAccount.loadData({ address: fields.recipient.address });
    broadcast();

    return resetTransactionResult;
  }, []);

  const { isBookmarked } = bookmarkInformation(bookmarks, fields);
  const { isHardwareWalletError, messageDetails } = getMessagesDetails(
    transactions, fields, t,
    isHardwareWalletConnected,
  );
  const success = !transactions.txBroadcastError && !isHardwareWalletError;
  const error = transactions.txBroadcastError
    && JSON.stringify(transactions.txBroadcastError);

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        title={messageDetails.title}
        illustration={success ? 'transactionSuccess' : 'transactionError'}
        message={messageDetails.paragraph}
        success={success}
        error={error}
      >
        {
          isHardwareWalletError || transactions.txBroadcastError
            ? (
              <SecondaryButton
                className={`${styles.btn} retry`}
                onClick={onRetry}
              >
                {t('Retry')}
              </SecondaryButton>
            )
            : null
        }
        {
          !isBookmarked && account.summary.address !== fields.recipient.address && (
            <div className={`${styles.bookmarkBtn} bookmark-container`}>
              <DialogLink
                component="addBookmark"
                data={recipientAccount.data.delegate ? {
                  formAddress: recipientAccount.data.address,
                  label: recipientAccount.data.delegate.username,
                  isDelegate: true,
                } : {
                  formAddress: fields.recipient.address,
                  isDelegate: false,
                  label: '',
                }}
              >
                <PrimaryButton className={`${styles.btn} bookmark-btn`}>
                  {t('Add address to bookmarks')}
                </PrimaryButton>
              </DialogLink>
            </div>
          )
        }
      </TransactionResult>
    </div>
  );
};

export default TransactionStatus;
