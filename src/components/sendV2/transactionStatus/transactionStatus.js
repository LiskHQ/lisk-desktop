import React from 'react';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import Piwik from '../../../utils/piwik';
import statusMessage from './statusMessages';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import FollowAccount from '../../followAccount';
import { getIndexOfFollowedAccount } from '../../../utils/followedAccounts';
import styles from './transactionStatus.css';

class TransactionStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFollowAccountDropdown: false,
    };

    this.followContainerRef = {};

    this.backToWallet = this.backToWallet.bind(this);
    this.onErrorReport = this.onErrorReport.bind(this);
    this.onPrevStep = this.onPrevStep.bind(this);
    this.onFollowingDropdownToggle = this.onFollowingDropdownToggle.bind(this);
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(this);
  }

  componentDidMount() {
    this.props.searchAccount({ address: this.props.fields.recipient.address });
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutsideDropdown);
  }

  backToWallet() {
    Piwik.trackingEvent('TransactionStatus', 'button', 'Back to wallet');
    // istanbul ignore else
    if (this.props.failedTransactions !== undefined) this.props.transactionFailedClear();
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

  // eslint-disable-next-line class-methods-use-this
  onErrorReport() {
    const recipient = 'hubdev@lisk.io';
    const subject = `User Reported Error - Lisk Hub - ${VERSION}`; // eslint-disable-line no-undef
    return `mailto:${recipient}?&subject=${subject}`;
  }

  onPrevStep() {
    this.props.transactionFailedClear();
    this.props.prevStep({ fields: { ...this.props.fields } });
  }

  // eslint-disable-next-line complexity
  render() {
    const hwTransactionError = this.props.fields.isHardwareWalletConnected && this.props.fields.hwTransactionStatus === 'error';
    const messages = statusMessage(this.props.t);
    let transactionStatus = this.props.failedTransactions === undefined
      ? messages.success
      : messages.error;

    const isFollowing = getIndexOfFollowedAccount(
      this.props.followedAccounts,
      { address: this.props.fields.recipient.address },
    ) !== -1;

    const followBtnLabel = isFollowing
      ? this.props.t('Account bookmarked')
      : this.props.t('Bookmark account');

    const delegate = Object.entries(this.props.delegates).length
      ? this.props.delegates[this.props.fields.recipient.address]
      : {};

    // istanbul ignore else
    if (this.props.fields.isHardwareWalletConnected) {
      transactionStatus = hwTransactionError ? messages.hw : messages.success;
    }

    return (
      <div className={`${styles.wrapper} transaction-status`}>
        <header className={styles.header}>
          <img src={transactionStatus.headerIcon}/>
        </header>
        <div className={`${styles.content} transaction-status-content`}>
          <h1>{transactionStatus.bodyText.title}</h1>
          <p className={'body-message'}>{transactionStatus.bodyText.paragraph}</p>
        </div>
        <footer className={`${styles.footer} transaction-status-footer`}>
          <div>
            {
              hwTransactionError
              ? <SecondaryButtonV2 label={this.props.t('Retry')} className={`${styles.btn} retry`} onClick={() => this.onPrevStep()} />
              : null
            }
            {
              !this.props.fields.recipient.following
              ? (<div
                  className={`${styles.followBtn} following-container`} ref={(node) => { this.followContainerRef = node; }}>
                  <SecondaryButtonV2
                    className={`${styles.btn} ${isFollowing ? styles.followingButton : ''} following-btn`}
                    onClick={this.onFollowingDropdownToggle}>
                    {followBtnLabel}
                  </SecondaryButtonV2>
                  <DropdownV2
                    showDropdown={this.state.isFollowAccountDropdown}
                    className={`${styles.followDropdown}`}>
                    <FollowAccount
                      delegate={delegate}
                      balance={this.props.fields.recipient.balance}
                      address={this.props.fields.recipient.address}
                      isFollowing={isFollowing} />
                  </DropdownV2>
                </div>)
              : null
            }
            <PrimaryButtonV2 className={`${styles.btn} on-goToWallet okay-button`} onClick={this.backToWallet}>{this.props.t('Back to wallet')}</PrimaryButtonV2>
          </div>
          {
            !(this.props.failedTransactions === undefined)
            ? <div className={`${styles.errorReport} transaction-status-error`}>
                <span>{this.props.t('Does the problem still persist?')}</span>
                <a
                  href={this.onErrorReport()}
                  target='_top'
                  rel='noopener noreferrer'>
                {this.props.t('Report the error via E-Mail')}
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
