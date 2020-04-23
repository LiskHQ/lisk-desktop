import React from 'react';
import { SecondaryButton } from '../../../toolbox/buttons/button';
import { getIndexOfBookmark } from '../../../../utils/bookmarks';
import { getTokenFromAddress } from '../../../../utils/api/transactions';
import BookmarkDropdown from '../../bookmarks/bookmarkDropdown';
import DropdownButton from '../../../toolbox/dropdownButton';
import TransactionResult from '../../../shared/transactionResult';
import statusMessage from './statusMessages';
import styles from './transactionStatus.css';

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
    const { bookmarks, t } = this.props;

    const isBookmarked = getIndexOfBookmark(
      bookmarks,
      { address: this.props.fields.recipient.address },
    ) !== -1;

    const bookmarkButtonLabel = isBookmarked
      ? t('Bookmarked')
      : t('Add address to bookmarks');

    return {
      isBookmarked,
      bookmarkButtonLabel,
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
      transactions, fields, t, finalCallback, recipientAccount,
    } = this.props;
    const { isBookmarked, bookmarkButtonLabel } = this.bookmarkInformation();
    const { isHardwareWalletError, messageDetails } = this.getMessagesDetails();
    const token = getTokenFromAddress(fields.recipient.address);
    const shouldShowBookmark = !transactions.broadcastedTransactionsError.length
      && !fields.recipient.isBookmark;
    const success = transactions.broadcastedTransactionsError.length === 0;

    return (
      <div className={`${styles.wrapper} transaction-status`}>
        <TransactionResult
          t={t}
          title={messageDetails.title}
          illustration={success ? 'transactionSuccess' : 'transactionError'}
          message={messageDetails.paragraph}
          success={success}
          primaryButon={{
            title: t('Back to Wallet'),
            className: 'on-goToWallet okay-button',
            onClick: finalCallback,
          }}
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
            shouldShowBookmark
              ? (
                <div className={`${styles.bookmarkBtn} bookmark-container`}>
                  <DropdownButton
                    buttonClassName={`${styles.btn} ${isBookmarked ? styles.bookmarkButton : ''} bookmark-btn`}
                    className={`${styles.bookmarkDropdown}`}
                    buttonLabel={bookmarkButtonLabel}
                    ButtonComponent={SecondaryButton}
                  >
                    <BookmarkDropdown
                      delegate={recipientAccount.data.delegate || {}}
                      address={fields.recipient.address}
                      publicKey={this.props.recipientAccount.data.publicKey}
                      isBookmark={isBookmarked}
                      token={token}
                    />
                  </DropdownButton>
                </div>
              )
              : null
          }
        </TransactionResult>
      </div>
    );
  }
}

export default TransactionStatus;
