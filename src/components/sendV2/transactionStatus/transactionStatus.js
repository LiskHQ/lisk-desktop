import React from 'react';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import Piwik from '../../../utils/piwik';
import statusMessage from './statusMessages';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import FollowAccount from '../../followAccount';
import { getIndexOfFollowedAccount } from '../../../utils/followedAccounts';
import styles from './transactionStatus.css';
import { getTokenFromAddress } from '../../../utils/api/transactions';

class TransactionStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFollowAccountDropdown: false,
    };

    this.followContainerRef = {};
    this.backToWallet = this.backToWallet.bind(this);
    this.onErrorReport = this.onErrorReport.bind(this);
    this.onRetry = this.onRetry.bind(this);
    this.onFollowingDropdownToggle = this.onFollowingDropdownToggle.bind(this);
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(this);
    this.getDelegateInformation = this.getDelegateInformation.bind(this);
  }

  componentDidMount() {
    this.props.searchAccount({ address: this.props.fields.recipient.address });
    this.transactionBroadcasted();
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutsideDropdown);
  }

  transactionBroadcasted() {
    const { transactions: { transactionsCreated }, transactionBroadcasted } = this.props;
    transactionsCreated.forEach(tx => transactionBroadcasted(tx));
  }

  backToWallet() {
    Piwik.trackingEvent('TransactionStatus', 'button', 'Back to wallet');
    this.props.resetTransactionResult();
    this.props.finalCallback();
  }

  onFollowingDropdownToggle() {
    if (this.state.isFollowAccountDropdown) {
      document.removeEventListener('click', this.handleClickOutsideDropdown);
    } else {
      document.addEventListener('click', this.handleClickOutsideDropdown);
    }

    this.setState(prevState => ({ isFollowAccountDropdown: !prevState.isFollowAccountDropdown }));
  }

  handleClickOutsideDropdown(e) {
    if (this.followContainerRef.contains(e.target)) return;
    this.onFollowingDropdownToggle();
  }

  followAccountInformation() {
    const { followedAccounts, t } = this.props;

    const isFollowing = getIndexOfFollowedAccount(
      followedAccounts,
      { address: this.props.fields.recipient.address },
    ) !== -1;

    const followButtonLabel = isFollowing
      ? t('Account bookmarked')
      : t('Bookmark account');

    return {
      isFollowing,
      followButtonLabel,
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

    if (fields.isHardwareWalletConnected) {
      messageDetails = isHardwareWalletError ? messages.hw : messages.success;
    }

    return {
      isHardwareWalletError,
      messageDetails,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  onErrorReport() {
    const recipient = 'hubdev@lisk.io';
    const subject = `User Reported Error - Lisk Hub - ${VERSION}`; // eslint-disable-line no-undef
    return `mailto:${recipient}?&subject=${subject}`;
  }

  onRetry() {
    const { transactions: { broadcastedTransactionsError }, transactionBroadcasted } = this.props;
    broadcastedTransactionsError.forEach(tx => transactionBroadcasted(tx));
  }

  render() {
    const { transactions, fields, t } = this.props;
    const { isFollowing, followButtonLabel } = this.followAccountInformation();
    const { isHardwareWalletError, messageDetails } = this.getMessagesDetails();
    const token = getTokenFromAddress(fields.recipient.address);
    const shouldShowFollowingAccount = !transactions.broadcastedTransactionsError.length
      && !fields.recipient.following;

    return (
      <div className={`${styles.wrapper} transaction-status`}>
        <header className={styles.header}>
          <img src={messageDetails.headerIcon}/>
        </header>
        <div className={`${styles.content} transaction-status-content`}>
          <h1>{messageDetails.bodyText.title}</h1>
          <p className={'body-message'}>{messageDetails.bodyText.paragraph}</p>
        </div>
        <footer className={`${styles.footer} transaction-status-footer`}>
          <div>
            {
              isHardwareWalletError || transactions.broadcastedTransactionsError.length
              ? <SecondaryButtonV2 label={t('Retry')} className={`${styles.btn} retry`} onClick={this.onRetry} />
              : null
            }
            {
              shouldShowFollowingAccount
              ? (<div
                  className={`${styles.followBtn} following-container`} ref={(node) => { this.followContainerRef = node; }}>
                  <SecondaryButtonV2
                    className={`${styles.btn} ${isFollowing ? styles.followingButton : ''} following-btn`}
                    onClick={this.onFollowingDropdownToggle}>
                    {followButtonLabel}
                  </SecondaryButtonV2>
                  <DropdownV2
                    showDropdown={this.state.isFollowAccountDropdown}
                    className={`${styles.followDropdown}`}>
                    <FollowAccount
                      delegate={this.getDelegateInformation()}
                      balance={fields.recipient.balance}
                      address={fields.recipient.address}
                      detailAccount={this.props.detailAccount}
                      token={token}
                      isFollowing={isFollowing} />
                  </DropdownV2>
                </div>)
              : null
            }

            <PrimaryButtonV2
              className={`${styles.btn} on-goToWallet okay-button`}
              onClick={this.backToWallet}>
              {t('Back to wallet')}
            </PrimaryButtonV2>
          </div>
          {
            transactions.broadcastedTransactionsError.length
            ? <div className={`${styles.errorReport} transaction-status-error`}>
                <span>{t('Does the problem still persist?')}</span>
                <a
                  href={this.onErrorReport()}
                  target='_top'
                  rel='noopener noreferrer'>
                {t('Report the error via E-Mail')}
                </a>
              </div>
            : null
          }
        </footer>
      </div>
    );
  }
}

export default TransactionStatus;
