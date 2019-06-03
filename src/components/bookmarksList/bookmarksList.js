import React from 'react';
import PropTypes from 'prop-types';
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
  onBookmarkSelected(address) {
    const { history } = this.props;
    history.push(`${routes.explorer.path}/accounts/${address}`);
  }

  getBookmarkListBasedOnSelectedToken() {
    const { bookmarks, token } = this.props;

    const actualBookmarks = { ...bookmarks };
    return actualBookmarks[token.active].length > 5
      ? actualBookmarks[token.active].slice(0, 5)
      : bookmarks[token.active];
  }

  displayAddressBasedOnSelectedToken(address) {
    const { token } = this.props;

    return token.active === tokenMap.LSK.key
      ? address
      : address.replace(regex.btcAddressTrunk, '$1...$3');
  }

  render() {
    const { t, token } = this.props;

    const selectedBookmarks = this.getBookmarkListBasedOnSelectedToken();

    return (
      <Box className={` ${styles.box} bookmarks-list`}>
        <header>
          <h2>Bookmarks</h2>
        </header>
        <div className={`${styles.bookmarkList} bookmark-list-container`}>
        {
          selectedBookmarks.length
          ? selectedBookmarks.map(bookmark =>
            <div
              key={bookmark.address}
              className={`${styles.row} bookmark-list-row`}
              onClick={() => this.onBookmarkSelected(bookmark.address)}>
              {
                token.active === tokenMap.LSK.key
                ? <AccountVisual address={bookmark.address} size={40}/>
                : null
              }
              <div className={styles.description}>
                <span>{bookmark.title}</span>
                <span>{this.displayAddressBasedOnSelectedToken(bookmark.address)}</span>
              </div>
            </div>)
          : <EmptyState>
              <img src={svg.bookmarksIconEmptyState} />
              <h1>{t('No Bookmarks added yet')}</h1>
              <p>{t('Start adding some addresses to bookmarks, to keep track of them.')}</p>
              <div>
                <Link to={'#'}>
                  <SecondaryButtonV2>{t('Search Accounts')}</SecondaryButtonV2>
                </Link>
              </div>
          </EmptyState>
        }
        {
          selectedBookmarks.length
          ? <div className={styles.footer}>
              <Link to={'#'}>
                <SecondaryButtonV2>{t('View All')}</SecondaryButtonV2>
              </Link>
            </div>
          : null
        }
        </div>
      </Box>
    );
  }
}

BookmarksList.propTypes = {
  bookmarks: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default BookmarksList;
