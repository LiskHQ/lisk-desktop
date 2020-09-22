import React from 'react';
import { SecondaryButton, PrimaryButton } from '../../../toolbox/buttons';
import { getIndexOfBookmark } from '../../../../utils/bookmarks';
import TransactionResult from '../../../shared/transactionResult';
import statusMessage from './statusMessages';
import styles from './transactionStatus.css';
import DialogLink from '../../../toolbox/dialog/link';

class TransactionStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isBookmarkDropdown: false,
    };
    this.isHardwareWalletConnected = !!(props.account.hwInfo && props.account.hwInfo.deviceId);

    this.transactionBroadcasted = this.transactionBroadcasted.bind(this);
    this.onRetry = this.onRetry.bind(this);
  }

  componentWillUnmount() {
    this.props.resetTransactionResult();
  }

  componentDidMount() {
    const { recipientAccount, fields } = this.props;
    recipientAccount.loadData({ address: fields.recipient.address });
    this.transactionBroadcasted();
  }

  transactionBroadcasted() {
    const {
      transactions: { transactionsCreated, transactionsCreatedFailed },
      transactionBroadcasted,
    } = this.props;

    if (transactionsCreated.length) transactionsCreated.forEach(tx => transactionBroadcasted(tx));
    if (transactionsCreatedFailed.length) {
      transactionsCreatedFailed.forEach(tx => transactionBroadcasted(tx));
    }
  }

  bookmarkInformation() {
    const { bookmarks } = this.props;

    const isBookmarked = getIndexOfBookmark(
      bookmarks,
      { address: this.props.fields.recipient.address },
    ) !== -1;

    return {
      isBookmarked,
    };
  }

  getMessagesDetails() {
    const { transactions, fields } = this.props;

    const isHardwareWalletError = this.isHardwareWalletConnected && fields.hwTransactionStatus === 'error';
    const messages = statusMessage(this.props.t);
    let messageDetails = !transactions.broadcastedTransactionsError.length
      ? messages.success
      : messages.error;


    if (transactions.broadcastedTransactionsError[0]
        && transactions.broadcastedTransactionsError[0].error
        && transactions.broadcastedTransactionsError[0].error.message) {
      messageDetails.paragraph = transactions.broadcastedTransactionsError[0].error.message;
    }

    if (this.isHardwareWalletConnected) {
      messageDetails = isHardwareWalletError ? messages.hw : messages.success;
    }

    return {
      isHardwareWalletError,
      messageDetails,
    };
  }

  onRetry() {
    const {
      transactions: { broadcastedTransactionsError },
      transactionBroadcasted,
      fields,
      prevStep,
      resetTransactionResult,
    } = this.props;

    if (this.isHardwareWalletConnected) {
      resetTransactionResult();
      prevStep({ ...fields, hwTransactionStatus: false });
    } else {
      broadcastedTransactionsError.forEach(({ transaction }) =>
        transactionBroadcasted(transaction));
    }
  }

  render() {
    const {
      transactions, t,
      recipientAccount, fields,
      account,
    } = this.props;
    const { isBookmarked } = this.bookmarkInformation();
    const { isHardwareWalletError, messageDetails } = this.getMessagesDetails();
    const success = transactions.broadcastedTransactionsError.length === 0;

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
                  label={t('Retry')}
                  className={`${styles.btn} retry`}
                  onClick={this.onRetry}
                />
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
  }
}

export default TransactionStatus;
