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
    this.getDelegateInformation = this.getDelegateInformation.bind(this);
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
    const { failedTransactions, fields } = this.props;

    const isHardwareWalletOnError = fields.isHardwareWalletConnected && fields.hwTransactionStatus === 'error';
    const messages = statusMessage(this.props.t);
    let messageDetails = failedTransactions === undefined
      ? messages.success
      : messages.error;

    if (fields.isHardwareWalletConnected) {
      messageDetails = isHardwareWalletOnError ? messages.hw : messages.success;
    }

    return {
      isHardwareWalletOnError,
      messageDetails,
    };
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

  render() {
    const { failedTransactions, fields, t } = this.props;
    const { isFollowing, followButtonLabel } = this.followAccountInformation();
    const { isHardwareWalletOnError, messageDetails } = this.getMessagesDetails();
    const isShowFollowingAccount = failedTransactions === undefined && !fields.recipient.following;

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
              isHardwareWalletOnError || failedTransactions !== undefined
              ? <SecondaryButtonV2 label={t('Retry')} className={`${styles.btn} retry`} onClick={() => this.onPrevStep()} />
              : null
            }
            {
              isShowFollowingAccount
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
            !(failedTransactions === undefined)
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
