import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import React from 'react';
import { PrimaryButton, SecondaryButton } from '../../../../toolbox/buttons/button';
import { getIndexOfBookmark } from '../../../../../utils/bookmarks';
import { tokenMap } from '../../../../../constants/tokens';
import BookmarkDropdown from '../../../bookmarks/bookmarkDropdown';
import DropdownButton from '../../../../toolbox/dropdownButton';
import HeaderAccountInfo from './headerAccountInfo';
import PageHeader from '../../../../toolbox/pageHeader';
import Request from '../request';
import routes from '../../../../../constants/routes';
import styles from './transactionsOverviewHeader.css';

class transactionsHeader extends React.Component {
  constructor(props) {
    super(props);
    this.setDropdownRef = this.setDropdownRef.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  setDropdownRef(node) {
    this.dropdown = node;
  }

  toggleDropdown() {
    this.dropdown.toggleDropdown();
  }

  render() {
    const {
      bookmarks, address, t, delegate = {}, activeToken, detailAccount,
    } = this.props;

    const isBookmark = getIndexOfBookmark(bookmarks, {
      address, token: activeToken,
    }) !== -1;
    const isWalletRoute = this.props.match.url === routes.wallet.path;

    return (isWalletRoute
      ? (
        <PageHeader
          className="wallet-header"
          title={t('{{token}} Wallet', { token: tokenMap[activeToken].label })}
          subtitle={t('Send, request and manage your LSK tokens.')}
        >
          <div className={`${styles.buttonsHolder}`}>
            <DropdownButton
              className={`${styles.requestDropdown} requestContainer request-dropdown`}
              buttonClassName="tx-receive-bt"
              buttonLabel={t('Request {{token}}', { token: activeToken })}
            >
              <Request address={address} token={activeToken} t={t} />
            </DropdownButton>
            <Link to={`${routes.send.path}?wallet`} className="tx-send-bt">
              <PrimaryButton>
                {t('Send {{token}}', { token: activeToken })}
              </PrimaryButton>
            </Link>
          </div>
        </PageHeader>
      )
      : (
        <header className={`${styles.wrapper}`}>
          <HeaderAccountInfo
            token={activeToken}
            bookmarks={bookmarks}
            address={address}
            delegate={delegate}
            account={this.props.account}
            toggleActiveToken={this.props.toggleActiveToken}
          />
          <div className={`${styles.buttonsHolder}`}>
            <Link
              to={`${routes.send.path}?wallet&recipient=${address}`}
              className="send-to-address"
            >
              <SecondaryButton>
                {t('Send {{token}} to this Account ', { token: activeToken })}
              </SecondaryButton>
            </Link>
            <DropdownButton
              buttonClassName="bookmark-account-button"
              className={`${styles.bookmarkDropdown} bookmark-account`}
              buttonLabel={isBookmark ? t('Edit bookmark') : t('Bookmark')}
              ButtonComponent={PrimaryButton}
              align="right"
              ref={this.setDropdownRef}
            >
              <BookmarkDropdown
                token={activeToken}
                delegate={delegate}
                address={address}
                detailAccount={detailAccount}
                isBookmark={isBookmark}
                onSubmitClick={this.toggleDropdown}
              />
            </DropdownButton>
          </div>
        </header>
      )
    );
  }
}

export default withTranslation()(transactionsHeader);
