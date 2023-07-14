import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import { selectActiveToken, selectBookmarks } from 'src/redux/selectors';
import Tooltip from '@theme/Tooltip';
import { Input } from 'src/theme';
import { PrimaryButton, TertiaryButton } from '@theme/buttons';
import WalletVisual from '@wallet/components/walletVisual';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import Icon from '@theme/Icon';
import EmptyState from '../EmptyState/EmptyState';
import styles from './BookmarksList.css';

// eslint-disable-next-line max-statements
export const BookmarksList = ({
  limit,
  bookmarkUpdated,
  bookmarkRemoved,
  onAddBookmark,
  className,
  enableFilter,
  isEditable,
  emptyStateClassName,
}) => {
  const [filter, setFilter] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [feedback, setFeedback] = useState('');
  const editInput = useRef();
  const activeToken = useSelector(selectActiveToken);
  const bookmarks = useSelector(selectBookmarks);
  const { t } = useTranslation();

  const getBookmarkListBasedOnSelectedToken = () =>
    bookmarks[activeToken]
      .filter(
        ({ title, address }) =>
          filter === '' ||
          title.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
          address.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      )
      .slice(0, limit);

  const onFilterChange = ({ target }) => {
    setFilter(target.value);
  };

  const updateBookmark = ({ address = '', title = '' }) => {
    setEditedAddress(address);
    setEditedTitle(title);
    setFeedback('');
  };

  const editBookmark = (e, bookmark) => {
    e.preventDefault();
    updateBookmark(bookmark);
    setTimeout(() => {
      editInput.current.select();
    }, 10);
  };

  const deleteBookmark = (e, { address }) => {
    e.preventDefault();
    bookmarkRemoved({ address, token: activeToken });
  };

  const saveChanges = () => {
    bookmarkUpdated({
      wallet: {
        address: editedAddress,
        title: editedTitle,
      },
      token: activeToken,
    });
    updateBookmark({});
  };

  const onTitleChange = ({ target: { value } }) => {
    setEditedTitle(value);
    setFeedback(value.length > 20 ? t('Label is too long.') : '');
  };

  const onRowClick = (e, bookmark) => {
    if (editedAddress || bookmark.disabled) {
      e.preventDefault();
    }
  };

  const selectedBookmarks = getBookmarkListBasedOnSelectedToken();

  return (
    <section className={` ${styles.wrapper} ${className} bookmarks-list`}>
      <Box className={styles.container}>
        <BoxHeader className={styles.heading}>
          <h2>{t('Bookmarks')}</h2>
        </BoxHeader>
      </Box>
      <Box className={styles.box}>
        <BoxHeader className={styles.header}>
          {enableFilter ? (
            <span className={styles.searchWrapper}>
              <Input
                className={`${styles.searchInput} bookmarks-filter-input`}
                icon="bookmarkActive"
                iconClassName={styles.icon}
                size="l"
                onChange={onFilterChange}
                value={filter}
                placeholder={t('Search by name or address')}
              />
            </span>
          ) : null}
          {isEditable && selectedBookmarks.length ? (
            <PrimaryButton className={styles.addButton} onClick={onAddBookmark} size="s">
              <Icon name="plus" className={styles.plusIcon} />
              {t('Add new')}
            </PrimaryButton>
          ) : null}
        </BoxHeader>
        <BoxContent className={`${styles.bookmarkList} bookmark-list-container`}>
          {selectedBookmarks.length ? (
            // eslint-disable-next-line complexity
            selectedBookmarks.map((bookmark) => (
              <Link
                onClick={(e) => onRowClick(e, bookmark)}
                key={bookmark.address}
                className={`${styles.row} ${
                  editedAddress === bookmark.address ? styles.editing : ''
                } ${bookmark.disabled ? styles.disabled : ''} bookmark-list-row`}
                to={`${routes.explorer.path}?address=${bookmark.address}`}
              >
                <div className={styles.avatarAndDescriptionWrapper}>
                  <WalletVisual className={styles.avatar} address={bookmark.address} />
                  {editedAddress === bookmark.address ? (
                    <Input
                      autoComplete="off"
                      className={`bookmarks-edit-input ${styles.editInput}`}
                      onChange={onTitleChange}
                      placeholder={t('Update name')}
                      setRef={editInput}
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
                      <span>{bookmark.address}</span>
                    </span>
                  )}
                </div>
                {isEditable ? (
                  <div className={styles.buttonContainer}>
                    {editedAddress === bookmark.address ? (
                      <>
                        <TertiaryButton
                          onClick={() => updateBookmark({})}
                          className={`bookmarks-cancel-button ${styles.cancelBtn}`}
                          size="m"
                        >
                          {t('Cancel')}
                        </TertiaryButton>
                        <TertiaryButton
                          onClick={saveChanges}
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
                            onClick={(e) => editBookmark(e, bookmark)}
                            className={`bookmarks-edit-button ${
                              bookmark.isValidator ? styles.hide : ''
                            }`}
                            size="m"
                            disabled={bookmark.isValidator || bookmark.disabled}
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
                          onClick={(e) => deleteBookmark(e, bookmark)}
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
              activeToken={activeToken}
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
};

BookmarksList.defaultProps = {
  emptyStateClassName: '',
};

export default BookmarksList;
