import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import React from 'react';

import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import { getIndexOfBookmark } from '../../../utils/bookmarks';
import { tokenMap } from '../../../constants/tokens';
import Bookmark from '../../bookmark';
import DropdownButton from '../../toolbox/dropdownButton';
import HeaderAccountInfo from './headerAccountInfo';
import Request from '../../request';
import routes from '../../../constants/routes';
import styles from './transactionsOverviewHeader.css';

class transactionsHeader extends React.Component {
  render() {
    const {
      bookmarks, address, t, delegate = {}, activeToken, detailAccount,
    } = this.props;

    const isBookmark = getIndexOfBookmark(bookmarks, {
      address, token: activeToken,
    }) !== -1;
    const isWalletRoute = this.props.match.url === routes.wallet.path;

    return (
      <header className={`${styles.wrapper}`}>
        { isWalletRoute ? (
          <React.Fragment>
            <span>
              <h1 className="wallet-header">{t('{{token}} Wallet', { token: tokenMap[activeToken].label })}</h1>
              <span className={styles.subtitle}>
                {t('All important information at a glance')}
              </span>
            </span>
            <div className={`${styles.buttonsHolder}`}>
              <DropdownButton
                className={`${styles.requestDropdown} requestContainer request-dropdown`}
                buttonClassName="tx-receive-bt"
                buttonLabel={t('Request {{token}}', { token: activeToken })}
              >
                <Request address={address} token={activeToken} t={t} />
              </DropdownButton>
              <Link to={`${routes.send.path}?wallet`} className="tx-send-bt">
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
              <Link
                to={`${routes.send.path}?wallet&recipient=${address}`}
                className="send-to-address"
              >
                <SecondaryButtonV2>
                  {t('Send {{token}} to this wallet ', { token: activeToken })}
                </SecondaryButtonV2>
              </Link>
              <DropdownButton
                buttonClassName={`${styles.bookmarkBtn} bookmark-account-button`}
                className={`${styles.bookmarkDropdown} bookmark-account`}
                buttonLabel={isBookmark ? t('Edit bookmark') : t('Bookmark')}
                ButtonComponent={PrimaryButtonV2}
              >
                <Bookmark
                  token={activeToken}
                  delegate={delegate}
                  address={address}
                  detailAccount={detailAccount}
                  isBookmark={isBookmark}
                />
              </DropdownButton>
            </div>
          </React.Fragment>
        )}
      </header>
    );
  }
}

export default translate()(transactionsHeader);
