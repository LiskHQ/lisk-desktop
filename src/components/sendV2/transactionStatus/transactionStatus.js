import React from 'react';

import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import { getIndexOfBookmark } from '../../../utils/bookmarks';
import { getTokenFromAddress } from '../../../utils/api/transactions';
import Bookmark from '../../bookmark';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import TransactionResult from '../../transactionResult';
import statusMessage from './statusMessages';
import styles from './transactionStatus.css';

class TransactionStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isBookmarkDropdown: false,
    };

    this.bookmarkContainerRef = {};
    this.onRetry = this.onRetry.bind(this);
    this.onBookmarkDropdownToggle = this.onBookmarkDropdownToggle.bind(this);
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(this);
    this.getDelegateInformation = this.getDelegateInformation.bind(this);
  }

  componentDidMount() {
    const { searchAccount, fields } = this.props;
    searchAccount({ address: fields.recipient.address });
    this.transactionBroadcasted();
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutsideDropdown);
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

  onBookmarkDropdownToggle() {
    if (this.state.isBookmarkDropdown) {
      document.removeEventListener('click', this.handleClickOutsideDropdown);
    } else {
      document.addEventListener('click', this.handleClickOutsideDropdown);
    }

    this.setState(prevState => ({ isBookmarkDropdown: !prevState.isBookmarkDropdown }));
  }

  handleClickOutsideDropdown(e) {
    if (this.bookmarkContainerRef.contains(e.target)) return;
    this.onBookmarkDropdownToggle();
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

  getDelegateInformation() {
    const { delegates, fields } = this.props;
    return Object.entries(delegates).length
      ? delegates[fields.recipient.address]
      : {};
  }

  getMessagesDetails() {
    const { transactions, fields } = this.props;

    const isHardwareWalletError = fields.isHardwareWalletConnected && fields.hwTransactionStatus === 'error';
    const messages = statusMessage(this.props.t);
    let messageDetails = !transactions.broadcastedTransactionsError.length
      ? messages.success
      : messages.error;


    if (transactions.broadcastedTransactionsError[0] &&
        transactions.broadcastedTransactionsError[0].error &&
        transactions.broadcastedTransactionsError[0].error.message) {
      messageDetails.paragraph = transactions.broadcastedTransactionsError[0].error.message;
    }

    if (fields.isHardwareWalletConnected) {
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

    if (fields.isHardwareWalletConnected) {
      resetTransactionResult();
      prevStep({ ...fields, hwTransactionStatus: false });
    } else {
      broadcastedTransactionsError.forEach(({ transaction }) =>
        transactionBroadcasted(transaction));
    }
  }

  render() {
    const {
      transactions, fields, t, finalCallback,
    } = this.props;
    const { isBookmarked, bookmarkButtonLabel } = this.bookmarkInformation();
    const { isHardwareWalletError, messageDetails } = this.getMessagesDetails();
    const token = getTokenFromAddress(fields.recipient.address);
    const shouldShowBookmark = !transactions.broadcastedTransactionsError.length
      && !fields.recipient.isBookmark;
    const success = transactions.broadcastedTransactionsError.length === 0;

    return (
      <div className={`${styles.wrapper} transaction-status`}>
        <TransactionResult t={t}
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
            isHardwareWalletError || transactions.broadcastedTransactionsError.length ?
            <SecondaryButtonV2
              label={t('Retry')}
              className={`${styles.btn} retry`}
              onClick={this.onRetry}
            /> :
            null
          }
          {
            shouldShowBookmark ?
            <div
              className={`${styles.bookmarkBtn} bookmark-container`}
              ref={(node) => { this.bookmarkContainerRef = node; }}>
              <SecondaryButtonV2
                className={`${styles.btn} ${isBookmarked ? styles.bookmarkButton : ''} bookmark-btn`}
                onClick={this.onBookmarkDropdownToggle}>
                {bookmarkButtonLabel}
              </SecondaryButtonV2>
              <DropdownV2
                showArrow={false}
                showDropdown={this.state.isBookmarkDropdown}
                className={`${styles.bookmarkDropdown}`}>
                <Bookmark
                  delegate={this.getDelegateInformation()}
                  address={fields.recipient.address}
                  detailAccount={this.props.detailAccount}
                  onSubmitClick={this.onBookmarkDropdownToggle}
                  isBookmark={isBookmarked}
                  token={token} />
              </DropdownV2>
            </div> :
            null
          }
        </TransactionResult>
      </div>
    );
  }
}

export default TransactionStatus;
