import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import Tooltip from 'src/theme/Tooltip';
import { Input } from 'src/theme';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import WalletVisual from '@wallet/components/walletVisual';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import EmptyState from '../EmptyState/EmptyState';
import styles from './BookmarksList.css';

export class BookmarksList extends React.Component {
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

    return bookmarks[token.active]
      .filter(
        ({ title, address }) =>
          filter === ''
          || title.toLowerCase().indexOf(filter.toLowerCase()) !== -1
          || address.toLowerCase().indexOf(filter.toLowerCase()) !== -1,
      )
      .slice(0, limit);
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
      wallet: {
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
      feedback:
        target.value.length > 20 ? this.props.t('Label is too long.') : '',
    });
  }

  onRowClick(e, bookmark) {
    const { editedAddress } = this.state;
    if (editedAddress || bookmark.disabled) {
      e.preventDefault();
    }
  }

  render() {
    const {
      t,
      token,
      className,
      enableFilter,
      isEditable,
      bookmarks,
      emptyStateClassName,
      limit,
      onAddBookmark,
    } = this.props;
    const {
      filter, editedAddress, editedTitle, feedback,
    } = this.state;

    const selectedBookmarks = this.getBookmarkListBasedOnSelectedToken();

    return (
      <section className={` ${styles.wrapper} ${className} bookmarks-list`}>
        {enableFilter ? (
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
        ) : null}
        <Box className={styles.box}>
          <BoxHeader>
            <h2 className={styles.heading}>{t('Bookmarks')}</h2>
            {isEditable && selectedBookmarks.length ? (
              <PrimaryButton
                className={styles.addButton}
                onClick={onAddBookmark}
                size="s"
              >
                <Icon name="plus" className={styles.plusIcon} />
                {t('Add new')}
              </PrimaryButton>
            ) : null}
          </BoxHeader>
          <BoxContent
            className={`${styles.bookmarkList} bookmark-list-container`}
          >
            {selectedBookmarks.length ? (
              // eslint-disable-next-line complexity
              selectedBookmarks.map((bookmark) => (
                <Link
                  onClick={(e) => this.onRowClick(e, bookmark)}
                  key={bookmark.address}
                  className={`${styles.row} ${
                    editedAddress === bookmark.address ? styles.editing : ''
                  } ${
                    bookmark.disabled ? styles.disabled : ''
                  } bookmark-list-row`}
                  to={`${routes.explorer.path}?address=${bookmark.address}`}
                >
                  <div className={styles.avatarAndDescriptionWrapper}>
                    <WalletVisual
                      className={styles.avatar}
                      address={bookmark.address}
                    />
                    {editedAddress === bookmark.address ? (
                      <Input
                        autoComplete="off"
                        className={`bookmarks-edit-input ${styles.editInput}`}
                        onChange={this.onTitleChange}
                        placeholder={t('Filter by name or address...')}
                        setRef={(input) => {
                          this.editInput = input;
                        }}
                        size="m"
                        value={editedTitle}
                        name="bookmarkName"
                        error={!!feedback}
                        feedback={feedback}
                        status={feedback ? 'error' : 'ok'}
                      />
                    ) : (
                      <span className={styles.description}>
                        <span>{bookmark.title}</span>
                        <span>
                          {bookmark.address}
                        </span>
                      </span>
                    )}
                  </div>
                  {isEditable ? (
                    <div className={styles.buttonContainer}>
                      {editedAddress === bookmark.address ? (
                        <>
                          <TertiaryButton
                            onClick={(e) => this.updateBookmark(e, {})}
                            className="bookmarks-cancel-button"
                            size="m"
                          >
                            {t('Cancel')}
                          </TertiaryButton>
                          <TertiaryButton
                            onClick={(e) => this.saveChanges(e)}
                            className="bookmarks-save-changes-button"
                            size="m"
                            disabled={!!feedback}
                          >
                            {t('Save changes')}
                          </TertiaryButton>
                        </>
                      ) : (
                        <>
                          {!bookmark.disabled ? (
                            <TertiaryButton
                              onClick={(e) => this.editBookmark(e, bookmark)}
                              className={`bookmarks-edit-button ${
                                bookmark.isValidator ? styles.hide : ''
                              }`}
                              size="m"
                              disabled={
                                bookmark.isValidator || bookmark.disabled
                              }
                            >
                              <Icon name="edit" />
                            </TertiaryButton>
                          ) : (
                            <Tooltip
                              tooltipClassName={styles.tooltipContainer}
                              position="bottom left"
                              size="maxContent"
                              indent
                              content={<Icon name="validatorWarning" />}
                            >
                              <span>
                                {t('This is a legacy account and can not be used on this network.')}
                              </span>
                            </Tooltip>
                          )}
                          <TertiaryButton
                            onClick={(e) => this.deleteBookmark(e, bookmark)}
                            className="bookmarks-delete-button"
                            size="m"
                          >
                            <Icon name="remove" />
                          </TertiaryButton>
                        </>
                      )}
                    </div>
                  ) : null}
                </Link>
              ))
            ) : (
              <EmptyState
                bookmarks={bookmarks}
                token={token}
                emptyStateClassName={emptyStateClassName}
                limit={limit}
                t={t}
                onAddBookmark={onAddBookmark}
              />
            )}
          </BoxContent>
        </Box>
      </section>
    );
  }
}

BookmarksList.defaultProps = {
  emptyStateClassName: '',
};

const mapStateToProps = (state) => ({
  bookmarks: state.bookmarks,
  token: state.token,
});

export default connect(mapStateToProps)(withTranslation()(BookmarksList));
