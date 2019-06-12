import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import React from 'react';

import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import { getIndexOfBookmark } from '../../../utils/bookmarks';
import { tokenMap } from '../../../constants/tokens';
import Bookmark from '../../bookmark';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import HeaderAccountInfo from './headerAccountInfo';
import OutsideClickHandler from '../../toolbox/outsideClickHandler';
import RequestV2 from '../../requestV2/requestV2';
import routes from '../../../constants/routes';
import styles from './transactionsOverviewHeader.css';

class transactionsHeader extends React.Component {
  constructor() {
    super();

    this.state = {
      shownDropdown: '',
    };

    this.dropdownRefs = {};

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.setDropownRefs = this.setDropownRefs.bind(this);
  }

  toggleDropdown(dropdownName) {
    this.setState(prevState => ({
      shownDropdown: prevState.shownDropdown === dropdownName ? '' : dropdownName,
    }));
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
      bookmarks, address, t, delegate = {}, activeToken, detailAccount,
    } = this.props;

    const isBookmark = getIndexOfBookmark(bookmarks, {
      address, token: activeToken,
    }) !== -1;
    const isWalletRoute = this.props.match.url === routes.wallet.path;

    const { shownDropdown } = this.state;

    return (
      <header className={`${styles.wrapper}`}>
        { isWalletRoute ? (
          <React.Fragment>
            <span>
              <h1 className='wallet-header'>{t('{{token}} Wallet', { token: tokenMap[activeToken].label })}</h1>
              <span className={styles.subtitle}>
                {t('All important information at a glance')}
              </span>
            </span>
            <div className={`${styles.buttonsHolder}`}>
              <span
                ref={this.setDropownRefs}
                data-name={'requestDropdown'}
                className={`${styles.requestContainer} tx-receive-bt`}>
                { /* TODO remove this condition when Request BTC is implemented */ }
                { activeToken !== 'BTC' ?
                <OutsideClickHandler
                  disabled={shownDropdown !== 'requestDropdown'}
                  onOutsideClick={() => this.toggleDropdown('requestDropdown')}
                >
                  <SecondaryButtonV2 onClick={() => this.toggleDropdown('requestDropdown')}>
                    {t('Request {{token}}', { token: activeToken })}
                  </SecondaryButtonV2>
                  <DropdownV2
                    showDropdown={this.state.shownDropdown === 'requestDropdown'}
                    className={`${styles.requestDropdown} request-dropdown`}>
                    <RequestV2 address={address} />
                  </DropdownV2>
                </OutsideClickHandler>
                : null }
              </span>
              <Link to={`${routes.send.path}?wallet`} className={'tx-send-bt'}>
                <PrimaryButtonV2>
                  {t('Send {{token}}', { token: activeToken })}
                </PrimaryButtonV2>
              </Link>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <HeaderAccountInfo
              token={activeToken}
              bookmarks={bookmarks}
              address={address}
              delegate={delegate}
              account={this.props.account}
              toggleActiveToken={this.props.toggleActiveToken}
              />
            <div className={`${styles.buttonsHolder}`}>
              <Link to={`${routes.send.path}?wallet&recipient=${address}`}
                className={'send-to-address'}>
                  <SecondaryButtonV2>
                    {t('Send {{token}} to this Account ', { token: activeToken })}
                  </SecondaryButtonV2>
              </Link>
              <span
                ref={this.setDropownRefs}
                data-name={'bookmarkDropdown'}
                className={`${styles.bookmarkContainer} bookmark-account`}>
              <OutsideClickHandler
                disabled={shownDropdown !== 'bookmarkDropdown'}
                onOutsideClick={() => this.toggleDropdown('bookmarkDropdown')}
              >
                { isBookmark ? (
                  <SecondaryButtonV2
                    className={`${styles.bookmarkButton}`}
                    onClick={
                      /* istanbul ignore next */
                      () => this.toggleDropdown('bookmarkDropdown')
                    }>
                    {t('Account bookmarked')}
                  </SecondaryButtonV2>
                ) : (
                  <PrimaryButtonV2 onClick={() => this.toggleDropdown('bookmarkDropdown')}>
                    {t('Bookmark account')}
                  </PrimaryButtonV2>
                )}
                <DropdownV2
                  showDropdown={this.state.shownDropdown === 'bookmarkDropdown'}
                  className={`${styles.followDropdown}`}>
                    <Bookmark
                      token={activeToken}
                      delegate={delegate}
                      address={address}
                      detailAccount={detailAccount}
                      isBookmark={isBookmark} />
                  </DropdownV2>
              </OutsideClickHandler>
              </span>
            </div>
          </React.Fragment>
        )}
      </header>
    );
  }
}

export default translate()(transactionsHeader);
