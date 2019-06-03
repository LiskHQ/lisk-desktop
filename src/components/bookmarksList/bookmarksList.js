import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AccountVisual from '../accountVisual';
import EmptyState from '../emptyStateV2';
import Box from '../boxV2';
import Tabs from '../toolbox/tabs';
import { tokenMap } from '../../constants/tokens';
import regex from '../../utils/regex';
import svg from '../../utils/svgIcons';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import styles from './bookmarksList.css';

class BookmarksList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeToken: props.token.active,
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange({ value }) {
    this.setState({ activeToken: value });
  }

  getBookmarkListBasedOnSelectedToken() {
    const { bookmarks } = this.props;
    const { activeToken } = this.state;

    const actualBookmarks = { ...bookmarks };
    return actualBookmarks[activeToken].length > 5
      ? actualBookmarks[activeToken].slice(0, 5)
      : bookmarks[activeToken];
  }

  displayAddressBasedOnSelectedToken(address) {
    const { activeToken } = this.state;
    return activeToken === tokenMap.LSK.key
      ? address
      : address.replace(regex.btcAddressTrunk, '$1...$3');
  }

  isMultipleCoinActive() {
    const { token } = this.props;
    return Object.values(token.list).filter(coin => coin === true).length > 1;
  }

  render() {
    const { t } = this.props;
    const { activeToken } = this.state;

    const selectedBookmarks = this.getBookmarkListBasedOnSelectedToken();
    const tabs = [
      {
        name: t('Lisk'),
        value: 'LSK',
        className: 'tab-lisk',
      },
      {
        name: t('Bitcoin'),
        value: 'BTC',
        className: 'tab-bitcoin',
      },
    ];

    return (
      <Box className={` ${styles.box} bookmarks-list`}>
        <header>
          <h2>Bookmarks</h2>
          {
            this.isMultipleCoinActive()
            ? <Tabs
                active={activeToken}
                onClick={this.onTabChange}
                className={styles.tab}
                tabs={tabs}
              />
            : null
          }
        </header>
        <div className={`${styles.bookmarkList} bookmark-list-container`}>
        {
          selectedBookmarks.length
          ? selectedBookmarks.map(bookmark =>
            <div key={bookmark.address} className={`${styles.row} bookmark-list-row`}>
              {
                activeToken === tokenMap.LSK.key
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
