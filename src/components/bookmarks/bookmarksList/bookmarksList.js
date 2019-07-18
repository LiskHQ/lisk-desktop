import { Link } from 'react-router-dom';
import React from 'react';
import { InputV2 } from '../../toolbox/inputsV2';
import Illustration from '../../toolbox/illustration';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import { tokenMap } from '../../../constants/tokens';
import AccountVisual from '../../accountVisual';
import Box from '../../box';
import EmptyState from '../../emptyStateV2';
import regex from '../../../utils/regex';
import routes from '../../../constants/routes';
import styles from './bookmarksList.css';
import svg from '../../../utils/svgIcons';

class BookmarksList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.editBookmark = this.editBookmark.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  getBookmarkListBasedOnSelectedToken() {
    const { bookmarks, token, limit } = this.props;
    const { filter } = this.state;

    return bookmarks[token.active].filter(({ title, address }) => (
      filter === ''
      || title.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      || address.toLowerCase().indexOf(filter.toLowerCase()) !== -1
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

  editBookmark(e, bookmark) {
    this.updateBookmark(e, bookmark);
    e.preventDefault();
    setTimeout(() => {
      this.editInput.select();
    }, 10);
  }

  updateBookmark(e, { address, title }) {
    this.setState({
      eddittedAddress: address,
      eddittedTitle: title,
    });
  }

  deleteBookmark(e, { address }) {
    const { token, bookmarkRemoved } = this.props;
    bookmarkRemoved({ address, token: token.active });
    e.preventDefault();
  }

  saveChanges(e) {
    const { token, bookmarkUpdated } = this.props;
    const { eddittedAddress, eddittedTitle } = this.state;
    bookmarkUpdated({
      account: {
        address: eddittedAddress,
        title: eddittedTitle,
      },
      token: token.active,
    });
    this.updateBookmark(e, {});
  }

  onTitleChange({ target }) {
    this.setState({
      eddittedTitle: target.value,
    });
  }

  onRowClick(e) {
    const { eddittedAddress } = this.state;
    if (eddittedAddress) {
      e.preventDefault();
    }
  }

  render() {
    const {
      t, token, className, enableFilter, title, isEditable, bookmarks, emptyStateClassName, limit,
    } = this.props;
    const {
      filter, eddittedAddress, eddittedTitle,
    } = this.state;

    const selectedBookmarks = this.getBookmarkListBasedOnSelectedToken();

    return (
      <Box className={` ${styles.box} ${className} bookmarks-list`}>
        <header>
          <h2>{title || t('Bookmarks')}</h2>
          { enableFilter
            ? (
              <span>
                <InputV2
                  className="bookmarks-filter-input"
                  size="xs"
                  onChange={this.onFilterChange}
                  value={filter}
                  placeholder={t('Filter by name...')}
                />
              </span>
            )
            : null
          }
        </header>
        <div className={`${styles.bookmarkList} bookmark-list-container`}>
          {
          selectedBookmarks.length
            ? selectedBookmarks.map(bookmark => (
              <Link
                onClick={this.onRowClick}
                key={bookmark.address}
                className={`${styles.row} ${eddittedAddress === bookmark.address ? styles.editting : ''} bookmark-list-row`}
                to={`${routes.accounts.path}/${bookmark.address}`}
              >
                <div className={styles.avatarAndDescriptionWrapper}>
                  {
                  token.active === tokenMap.LSK.key
                    ? (
                      <AccountVisual
                        className={styles.avatar}
                        address={bookmark.address}
                        size={40}
                      />
                    )
                    : null
                }
                  { eddittedAddress === bookmark.address
                    ? (
                      <InputV2
                        className={`bookmarks-edit-input ${styles.editInput}`}
                        size="m"
                        onChange={this.onTitleChange}
                        value={eddittedTitle}
                        setRef={(input) => { this.editInput = input; }}
                        placeholder={t('Filter by name...')}
                      />
                    )
                    : (
                      <span className={styles.description}>
                        <span>{bookmark.title}</span>
                        <span>{this.displayAddressBasedOnSelectedToken(bookmark.address)}</span>
                      </span>
                    )
                }
                </div>
                { isEditable
                  ? (
                    <div className={styles.buttonContainer}>
                      { eddittedAddress === bookmark.address
                        ? (
                          <React.Fragment>
                            <SecondaryButtonV2
                              onClick={e => this.updateBookmark(e, {})}
                              className="medium bookmarks-cancel-button"
                            >
                              {t('Cancel')}
                            </SecondaryButtonV2>
                            <PrimaryButtonV2
                              onClick={e => this.saveChanges(e)}
                              className="medium bookmarks-save-changes-button"
                            >
                              {t('Save changes')}
                            </PrimaryButtonV2>
                          </React.Fragment>
                        )
                        : (
                          <React.Fragment>
                            <SecondaryButtonV2
                              onClick={e => this.editBookmark(e, bookmark)}
                              className="medium bookmarks-edit-button"
                            >
                              {t('Edit')}
                            </SecondaryButtonV2>
                            <PrimaryButtonV2
                              onClick={e => this.deleteBookmark(e, bookmark)}
                              className={`medium bookmarks-delete-button ${styles.deleteButton}`}
                            >
                              {t('Delete')}
                            </PrimaryButtonV2>
                          </React.Fragment>
                        )
                  }
                    </div>
                  )
                  : null
              }
              </Link>
            ))
            : (
              <React.Fragment>
                { bookmarks[token.active].length
                  ? (
                    <EmptyState className={emptyStateClassName}>
                      <Illustration name="emptyBookmarkFiler" className="bookmark-empty-filter-illustration" />
                      <p>{t('There are no results matching this filter.')}</p>
                    </EmptyState>
                  )
                  : (
                    <EmptyState className={emptyStateClassName}>
                      { limit
                        ? (
                          <React.Fragment>
                            <img src={svg.bookmarksIconEmptyState} />
                            <h1>{t('No Bookmarks added yet')}</h1>
                            <p>{t('Start adding some addresses to bookmarks, to keep track of them.')}</p>
                            <Link to={routes.addBookmark.path}>
                              <SecondaryButtonV2>{t('Add a new bookmark')}</SecondaryButtonV2>
                            </Link>
                          </React.Fragment>
                        )
                        : (
                          <React.Fragment>
                            <Illustration name="emptyBookmarksList" className="bookmarks-empty-illustration" />
                            <p>{t('You don’t have any bookmarks yet.')}</p>
                          </React.Fragment>
                        )
                  }
                    </EmptyState>
                  )
            }
              </React.Fragment>
            )
        }
          {
          selectedBookmarks.length && limit
            ? (
              <div className={styles.footer}>
                <Link to={routes.bookmarks.path}>
                  <SecondaryButtonV2>{t('View All')}</SecondaryButtonV2>
                </Link>
              </div>
            )
            : null
        }
        </div>
      </Box>
    );
  }
}

BookmarksList.defaultProps = {
  emptyStateClassName: '',
};

export default BookmarksList;
