import React, { useEffect } from 'react';
import { getIndexOfBookmark } from '@utils/bookmarks';
import { isEmpty } from '@utils/helpers';
import { SecondaryButton, PrimaryButton } from '@toolbox/buttons';
import { TransactionResult, getBroadcastStatus } from '@shared/transactionResult';
import DialogLink from '@toolbox/dialog/link';
import { toRawLsk } from '@utils/lsk';
import statusMessages from './statusMessages';
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

const getHwError = (isHardwareWalletConnected, fields) => (
  isHardwareWalletConnected && fields.hwTransactionStatus === 'error'
);

const getMessagesDetails = (transactions, status, t, isHardwareWalletError) => {
  const messages = statusMessages(t);
  const code = isHardwareWalletError ? 'hw' : status.code;
  const messageDetails = messages[code];

  if (status.code === 'error'
      && transactions.txBroadcastError?.error?.message) {
    messageDetails.message = transactions.txBroadcastError.error.message;
  }

  return messageDetails;
};

// eslint-disable-next-line complexity
// eslint-disable-next-line max-statements
const TransactionStatus = ({
  transactionBroadcasted,
  resetTransactionResult,
  transactionCreated,
  recipientAccount,
  transactions,
  bookmarks,
  prevStep,
  account,
  fields,
  t,
}) => {
  const isHardwareWalletConnected = !!account.hwInfo?.deviceId;

  const broadcast = () => {
    if (!isEmpty(transactions.signedTransaction)) {
      console.log('BROADCAST');
      console.log(`nonce: ${account.sequence.nonce}`);
      console.log(`txId: ${transactions.signedTransaction.id.toString('hex')}`);
      transactionBroadcasted(transactions.signedTransaction);
    }
  };

  const onRetry = () => {
    const { txBroadcastError } = transactions;

    if (isHardwareWalletConnected) {
      resetTransactionResult();
      prevStep({ ...fields, hwTransactionStatus: false });
    } else {
      transactionBroadcasted(txBroadcastError.transaction);
    }
  };

  useEffect(() => {
    recipientAccount.loadData({ address: fields.recipient.address });
    return resetTransactionResult;
  }, []);

  useEffect(() => {
    broadcast();
  }, [transactions.signedTransaction]);

  useEffect(() => {
    if (account.sequence.nonce > transactions.txBroadcastError?.transaction?.nonce) {
      console.log('- create tx with updated nonce -');
      transactionCreated({
        amount: `${toRawLsk(fields.amount.value)}`,
        data: fields.reference ? fields.reference.value : '',
        recipientAddress: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
        fee: toRawLsk(parseFloat(fields.fee.value)),
      });
    }
  }, [account.sequence.nonce]);

  const { isBookmarked } = bookmarkInformation(bookmarks, fields);
  const isHardwareWalletError = getHwError(isHardwareWalletConnected, fields);
  const status = getBroadcastStatus(transactions, isHardwareWalletError);
  const template = getMessagesDetails(
    transactions, status, t,
    isHardwareWalletError,
  );

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        title={template.title}
        illustration="default"
        message={template.message}
        status={status}
      >
        {
          isHardwareWalletError
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
