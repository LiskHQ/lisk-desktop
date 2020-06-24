import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../toolbox/inputs';
import { PrimaryButton, TertiaryButton } from '../../../toolbox/buttons/button';
import { tokenMap } from '../../../../constants/tokens';
import AccountVisual from '../../../toolbox/accountVisual';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import EmptyState from './emptyState';
import regex from '../../../../utils/regex';
import routes from '../../../../constants/routes';
import styles from './bookmarksList.css';
import Icon from '../../../toolbox/icon';

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
      editedAddress: address,
      editedTitle: title,
      feedback: '',
    });
  }

  deleteBookmark(e, { address }) {
    const { token, bookmarkRemoved } = this.props;
    bookmarkRemoved({ address, token: token.active });
    e.preventDefault();
  }

  saveChanges(e) {
    const { token, bookmarkUpdated } = this.props;
    const { editedAddress, editedTitle } = this.state;
    bookmarkUpdated({
      account: {
        address: editedAddress,
        title: editedTitle,
      },
      token: token.active,
    });
    this.updateBookmark(e, {});
  }

  onTitleChange({ target }) {
    this.setState({
      editedTitle: target.value,
      feedback: target.value.length > 20 ? this.props.t('Label is too long.') : '',
    });
  }

  onRowClick(e) {
    const { editedAddress } = this.state;
    if (editedAddress) {
      e.preventDefault();
    }
  }

  render() {
    const {
      t, token, className, enableFilter, isEditable,
      bookmarks, emptyStateClassName, limit, nextStep,
    } = this.props;
    const {
      filter, editedAddress, editedTitle, feedback,
    } = this.state;

    const selectedBookmarks = this.getBookmarkListBasedOnSelectedToken();

    return (
      <section className={` ${styles.wrapper} ${className} bookmarks-list`}>
        { enableFilter
          ? (
            <header className={styles.header}>
              <span>
                <Input
                  className={`${styles.searchInput} bookmarks-filter-input`}
                  icon="bookmarkActive"
                  iconClassName={styles.icon}
                  size="l"
                  onChange={this.onFilterChange}
                  value={filter}
                  placeholder={t('Search by name or address')}
                />
              </span>
            </header>
          )
          : null
        }
        <Box className={styles.box}>
          <BoxHeader>
            <h2 className={styles.heading}>{t('Bookmarks')}</h2>
            {
              isEditable && selectedBookmarks.length
                ? (
                  <PrimaryButton
                    className={styles.addButton}
                    onClick={() => nextStep({})}
                    size="s"
                  >
                    <Icon name="plus" className={styles.plusIcon} />
                    {t('Add new')}
                  </PrimaryButton>
                ) : null
            }
          </BoxHeader>
          <BoxContent className={`${styles.bookmarkList} bookmark-list-container`}>
            {
            selectedBookmarks.length
              ? selectedBookmarks.map(bookmark => (
                <Link
                  onClick={this.onRowClick}
                  key={bookmark.address}
                  className={`${styles.row} ${editedAddress === bookmark.address ? styles.editting : ''} bookmark-list-row`}
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
                    {
                      editedAddress === bookmark.address
                        ? (
                          <Input
                            autoComplete="off"
                            className={`bookmarks-edit-input ${styles.editInput}`}
                            onChange={this.onTitleChange}
                            placeholder={t('Filter by name or address...')}
                            setRef={(input) => { this.editInput = input; }}
                            size="m"
                            value={editedTitle}
                            name="bookmarkName"
                            error={!!feedback}
                            feedback={feedback}
                            status={feedback ? 'error' : 'ok'}
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
                        { editedAddress === bookmark.address
                          ? (
                            <React.Fragment>
                              <TertiaryButton
                                onClick={e => this.updateBookmark(e, {})}
                                className="bookmarks-cancel-button"
                                size="m"
                              >
                                {t('Cancel')}
                              </TertiaryButton>
                              <TertiaryButton
                                onClick={e => this.saveChanges(e)}
                                className="bookmarks-save-changes-button"
                                size="m"
                                disabled={!!feedback}
                              >
                                {t('Save changes')}
                              </TertiaryButton>
                            </React.Fragment>
                          )
                          : (
                            <React.Fragment>
                              <TertiaryButton
                                onClick={e => this.editBookmark(e, bookmark)}
                                className="bookmarks-edit-button"
                                size="m"
                                disabled={bookmark.isDelegate}
                              >
                                <Icon name="edit" />
                              </TertiaryButton>
                              <TertiaryButton
                                onClick={e => this.deleteBookmark(e, bookmark)}
                                className="bookmarks-delete-button"
                                size="m"
                              >
                                <Icon name="remove" />
                              </TertiaryButton>
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
                <EmptyState
                  bookmarks={bookmarks}
                  token={token}
                  emptyStateClassName={emptyStateClassName}
                  limit={limit}
                  t={t}
                  nextStep={nextStep}
                />
              )
          }
          </BoxContent>
        </Box>
      </section>
    );
  }
}

BookmarksList.defaultProps = {
  emptyStateClassName: '',
};

export default BookmarksList;
