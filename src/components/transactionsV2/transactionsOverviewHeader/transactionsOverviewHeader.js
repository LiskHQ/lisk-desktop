import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import RequestV2 from '../../requestV2/requestV2';
import { getIndexOfFollowedAccount } from '../../../utils/followedAccounts';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import HeaderAccountInfo from './headerAccountInfo';
import styles from './transactionsOverviewHeader.css';
import routes from '../../../constants/routes';

class transactionsHeader extends React.Component {
  constructor() {
    super();

    this.state = {
      shownDropdown: '',
    };

    this.dropdownRefs = {};

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(this);
    this.setDropownRefs = this.setDropownRefs.bind(this);
  }

  toggleDropdown(dropdownName) {
    if (!(this.state.shownDropdown === dropdownName)) {
      document.addEventListener('click', this.handleClickOutsideDropdown);
    } else {
      document.removeEventListener('click', this.handleClickOutsideDropdown);
    }

    this.setState(prevState => ({
      shownDropdown: prevState.shownDropdown === dropdownName ? '' : dropdownName,
    }));
  }

  // istanbul ignore next
  handleClickOutsideDropdown(e) {
    const dropdownName = this.state.shownDropdown;
    const ref = this.dropdownRefs[dropdownName];
    if (ref && ref.contains(e.target)) return;
    this.toggleDropdown(dropdownName);
  }

  setDropownRefs(node) {
    const dropdownName = node && node.dataset && node.dataset.name;
    this.dropdownRefs = dropdownName ? {
      ...this.dropdownRefs,
      [dropdownName]: node,
    } : this.dropdownRefs;
  }

  render() {
    const {
      followedAccounts, address, t, delegate = {},
    } = this.props;

    const isFollowing = getIndexOfFollowedAccount(followedAccounts, { address }) !== -1;
    const isWalletRoute = this.props.match.url === routes.wallet.path;

    return (
      <header className={`${styles.wrapper}`}>
        <HeaderAccountInfo
          followedAccounts={followedAccounts}
          address={address}
          delegate={delegate}
          account={this.props.account}
          />
        <div className={`${styles.buttonsHolder}`}>
        { isWalletRoute ? (
          <React.Fragment>
            <span
              ref={this.setDropownRefs}
              data-name={'requestDropdown'}
              className={`${styles.requestContainer} help-onboarding tx-receive-bt`}>
              <SecondaryButtonV2 onClick={() => this.toggleDropdown('requestDropdown')}>
                {t('Request LSK')}
              </SecondaryButtonV2>
              <DropdownV2
                showDropdown={this.state.shownDropdown === 'requestDropdown'}
                className={`${styles.requestDropdown} request-dropdown`}>
                <RequestV2 address={address} />
              </DropdownV2>
            </span>
            <Link to={`${routes.send.path}?wallet`} className={'tx-send-bt'}>
              <PrimaryButtonV2>
                {t('Send LSK')}
              </PrimaryButtonV2>
            </Link>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to={`${routes.send.path}?wallet&recipient=${address}`}
              className={'send-to-address'}>
                <SecondaryButtonV2>
                  {t('Send LSK to this Wallet')}
                </SecondaryButtonV2>
            </Link>
            <span
              ref={this.setDropownRefs}
              data-name={'followDropdown'}
              className={'follow-account'}>
            { isFollowing ? (
              <SecondaryButtonV2
                className={`${styles.followingButton}`}
                onClick={() => this.toggleDropdown('followDropdown')}>
                {t('Following')}
              </SecondaryButtonV2>
            ) : (
              <PrimaryButtonV2 onClick={() => this.toggleDropdown('followDropdown')}>
                {t('Follow')}
              </PrimaryButtonV2>
            )}
            <DropdownV2
              showDropdown={this.state.shownDropdown === 'followDropdown'}
              className={'follow-dropdown'}></DropdownV2>
            </span>
          </React.Fragment>
        )}
        </div>
      </header>
    );
  }
}

export default translate()(transactionsHeader);
