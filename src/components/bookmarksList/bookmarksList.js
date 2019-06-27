import { Link } from 'react-router-dom';
import React from 'react';
import { InputV2 } from '../toolbox/inputsV2';
import { tokenMap } from '../../constants/tokens';
import AccountVisual from '../accountVisual';
import Box from '../boxV2';
import EmptyState from '../emptyStateV2';
import regex from '../../utils/regex';
import routes from '../../constants/routes';
import styles from './bookmarksList.css';
import svg from '../../utils/svgIcons';

class BookmarksList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
    };

    this.onFilterChange = this.onFilterChange.bind(this);
  }
  getBookmarkListBasedOnSelectedToken() {
    const { bookmarks, token, limit } = this.props;
    const { filter } = this.state;

    return bookmarks[token.active].filter(({ title, address }) => (
      filter === '' ||
      title.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
      address.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    )).slice(0, limit);
  }

  displayAddressBasedOnSelectedToken(address) {
    const { token } = this.props;

    return token.active === tokenMap.LSK.key
      ? address
      : address.replace(regex.btcAddressTrunk, '$1...$3');
  }

  onFilterChange({ target }) {
    this.setState({
      filter: target.value,
    });
  }

  render() {
    const {
      t, token, className, enableFilter, title,
    } = this.props;
    const { filter } = this.state;

    const selectedBookmarks = this.getBookmarkListBasedOnSelectedToken();

    return (
      <Box className={` ${styles.box} ${className} bookmarks-list`}>
        <header>
          <h2>{title || t('Bookmarks')}</h2>
          { enableFilter
            ? <span>
                <InputV2
                  className='bookmarks-filter-input'
                  size='xs'
                  onChange={this.onFilterChange}
                  value={filter}
                  placeholder={t('Filter by name...')}
                />
              </span>
            : null
          }
        </header>
        <div className={`${styles.bookmarkList} bookmark-list-container`}>
        {
          selectedBookmarks.length
          ? selectedBookmarks.map(bookmark =>
            <Link
              key={bookmark.address}
              className={`${styles.row} bookmark-list-row`}
              to={`${routes.accounts.path}/${bookmark.address}`}>
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
                { /* TODO - pass the correct link when bookmarks page is avaiable
                  <Link to={'#'}>
                    <SecondaryButtonV2>{t('Search Accounts')}</SecondaryButtonV2>
                  </Link>
                */ }
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
