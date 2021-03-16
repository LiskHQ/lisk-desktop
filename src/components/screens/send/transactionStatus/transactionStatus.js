import React, { useEffect } from 'react';
import { getIndexOfBookmark } from '@utils/bookmarks';
import { SecondaryButton, PrimaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';
import statusMessage from './statusMessages';
import styles from './transactionStatus.css';
import DialogLink from '../../../toolbox/dialog/link';

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
  let messageDetails = !transactions.broadcastedTransactionsError.length
    ? messages.success
    : messages.error;


  if (transactions.broadcastedTransactionsError[0]
      && transactions.broadcastedTransactionsError[0].error
      && transactions.broadcastedTransactionsError[0].error.message) {
    messageDetails.paragraph = transactions.broadcastedTransactionsError[0].error.message;
  }

  if (isHardwareWalletConnected) {
    messageDetails = isHardwareWalletError ? messages.hw : messages.success;
  }

  return {
    isHardwareWalletError,
    messageDetails,
  };
};

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
    const { transactionsCreated, transactionsCreatedFailed } = transactions;

    if (transactionsCreated.length) {
      transactionsCreated.forEach(tx => transactionBroadcasted(tx));
    }

    if (transactionsCreatedFailed.length) {
      transactionsCreatedFailed.forEach(tx => transactionBroadcasted(tx));
    }
  };

  const onRetry = () => {
    const { broadcastedTransactionsError } = transactions;

    if (isHardwareWalletConnected) {
      resetTransactionResult();
      prevStep({ ...fields, hwTransactionStatus: false });
    } else {
      broadcastedTransactionsError.forEach(({ transaction }) =>
        transactionBroadcasted(transaction));
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
  const success = transactions.broadcastedTransactionsError.length === 0 && !isHardwareWalletError;

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        title={messageDetails.title}
        illustration={success ? 'transactionSuccess' : 'transactionError'}
        message={messageDetails.paragraph}
        success={success}
      >
        {
          isHardwareWalletError || transactions.broadcastedTransactionsError.length
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
          !isBookmarked && account.address !== fields.recipient.address && (
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
