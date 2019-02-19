import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import AccountVisual from '../../accountVisual';
import { getIndexOfFollowedAccount } from '../../../utils/followedAccounts';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import RequestV2 from '../../requestV2/requestV2';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import styles from './transactionsOverviewHeader.css';
import routes from '../../../constants/routes';

class transactionsHeader extends React.Component {
  constructor() {
    super();

    this.state = {
      showRequestDropdown: false,
    };

    this.toggleRequestDropdown = this.toggleRequestDropdown.bind(this);
    this.handleClickOutsideRequest = this.handleClickOutsideRequest.bind(this);
    this.setRequestDropdownRef = this.setRequestDropdownRef.bind(this);
  }

  toggleRequestDropdown() {
    if (!this.state.showRequestDropdown) {
      document.addEventListener('click', this.handleClickOutsideRequest);
    } else {
      document.removeEventListener('click', this.handleClickOutsideRequest);
    }

    this.setState(prevState => ({ showRequestDropdown: !prevState.showRequestDropdown }));
  }

  // istanbul ignore next
  handleClickOutsideRequest(e) {
    if (this.requestDropdownRef && this.requestDropdownRef.contains(e.target)) return;
    this.toggleRequestDropdown();
  }

  setRequestDropdownRef(node) {
    this.requestDropdownRef = node;
  }

  render() {
    const {
      followedAccounts, address, t, delegate = {},
    } = this.props;
    const index = getIndexOfFollowedAccount(
      followedAccounts,
      { address },
    );
    let accountTitle = followedAccounts[index]
      && followedAccounts[index].title;
    accountTitle = delegate.username || accountTitle;

    const hasTitle = index !== -1 && accountTitle !== address;

    const isMyWallet = address === this.props.account.address;

    return (
      <header className={`${styles.wrapper}`}>
        <div className={`${styles.account}`}>
          <AccountVisual
            address={address}
            size={48}
            />
          { isMyWallet ? (
            <div className={styles.accountInfo}>
              <div>
                <h2 className={`${styles.title}`}>
                { hasTitle
                  ? <span className={'account-title'}>{accountTitle}</span>
                  : <span>{t('Wallet')}</span>
                }
                </h2>
                <span className={`${styles.label} my-account`}>
                  {t('My Account')}
                </span>
              </div>
              <span className={styles.address}>
                {address}
              </span>
            </div>
          ) : (
            <div className={styles.accountInfo}>
              <div>
                <h2 className={`${styles.title}`}>
                { hasTitle
                  ? <span className={'account-title'}>{accountTitle}</span>
                  : <span>{address}</span>
                }
                </h2>
              </div>
              { hasTitle
                ? <span className={styles.address}>{address}</span>
                : null
              }
            </div>
          )}
        </div>

          <div className={`${styles.buttonsHolder}`}>
          { isMyWallet ?
            <span
              ref={this.setRequestDropdownRef}
              className={`${styles.requestContainer} help-onboarding tx-receive-bt`}>
              <SecondaryButtonV2 onClick={this.toggleRequestDropdown}>
                {t('Request LSK')}
              </SecondaryButtonV2>
              <DropdownV2 showDropdown={this.state.showRequestDropdown} className={`${styles.requestDropdown} request-dropdown`}>
                <RequestV2 address={address} />
              </DropdownV2>
            </span>
          : null }
            <Link to={`${routes.send.path}?wallet&recipient=${address}`} className={'tx-send-bt'}>
              <PrimaryButtonV2>
                {t('Send LSK')}
              </PrimaryButtonV2>
            </Link>
          </div>
      </header>
    );
  }
}

export default translate()(transactionsHeader);
