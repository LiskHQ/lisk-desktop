import React from 'react';
import { Link } from 'react-router-dom';
import AccountVisual from '../accountVisual';
import EmptyState from '../emptyStateV2';
import Box from '../boxV2';
import { tokenMap } from '../../constants/tokens';
import regex from '../../utils/regex';
import svg from '../../utils/svgIcons';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import routes from '../../constants/routes';
import styles from './bookmarksList.css';

class BookmarksList extends React.Component {
  getBookmarkListBasedOnSelectedToken() {
    const { bookmarks, token } = this.props;

    const actualBookmarks = { ...bookmarks };
    return actualBookmarks[token.active].slice(0, 5);
  }

  displayAddressBasedOnSelectedToken(address) {
    const { token } = this.props;

    return token.active === tokenMap.LSK.key
      ? address
      : address.replace(regex.btcAddressTrunk, '$1...$3');
  }

  render() {
    const { t, token, className } = this.props;

    const selectedBookmarks = this.getBookmarkListBasedOnSelectedToken();

    return (
      <Box className={` ${styles.box} ${className} bookmarks-list`}>
        <header>
          <h2>Bookmarks</h2>
        </header>
        <div className={`${styles.bookmarkList} bookmark-list-container`}>
        {
          selectedBookmarks.length
          ? selectedBookmarks.map(bookmark =>
            <Link
              key={bookmark.address}
              className={`${styles.row} bookmark-list-row`}
              to={`${routes.explorer.path}/accounts/${bookmark.address}`}>
              {
                token.active === tokenMap.LSK.key
                ? <AccountVisual className={styles.avatar} address={bookmark.address} size={40}/>
                : null
              }
              <div className={styles.description}>
                <span>{bookmark.title}</span>
                <span>{this.displayAddressBasedOnSelectedToken(bookmark.address)}</span>
              </div>
            </Link>)
          : <EmptyState>
              <img src={svg.bookmarksIconEmptyState} />
              <h1>{t('No Bookmarks added yet')}</h1>
              <p>{t('Start adding some addresses to bookmarks, to keep track of them.')}</p>
              <div>
                { /* TODO - pass the correct link when bookmarks page is avaiable */ }
                <Link to={'#'}>
                  <SecondaryButtonV2>{t('Search Accounts')}</SecondaryButtonV2>
                </Link>
              </div>
          </EmptyState>
        }
        {
          /* TODO - pass the correct link when bookmarks page is avaiable  and enable this button
          selectedBookmarks.length
          ? <div className={styles.footer}>
              <Link to={'#'}>
                <SecondaryButtonV2>{t('View All')}</SecondaryButtonV2>
              </Link>
            </div>
          : null */
        }
        </div>
      </Box>
    );
  }
}

export default BookmarksList;
