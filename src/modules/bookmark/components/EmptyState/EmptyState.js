import React from 'react';
import Illustration from '@basics/illustration';
import { PrimaryButton } from '@basics/buttons';
import BoxEmptyState from '@basics/box/emptyState';
import Icon from '@basics/icon';
import styles from '../BookmarksList/BookmarksList.css'; // @todo split the css

const EmptyState = ({
  bookmarks, token, emptyStateClassName, t, onAddBookmark,
}) => (
  <>
    { bookmarks[token.active].length
      ? (
        <BoxEmptyState className={emptyStateClassName}>
          <Illustration name="emptyBookmarkFiler" className="bookmark-empty-filter-illustration" />
          <p>{t('There are no results matching your search term.')}</p>
        </BoxEmptyState>
      )
      : (
        <BoxEmptyState className={emptyStateClassName}>
          <>
            <Illustration name="emptyBookmarksList" className="bookmarks-empty-illustration" />
            <p>{t('You don’t have any bookmarks yet.')}</p>
            <PrimaryButton
              className={styles.addButton}
              onClick={onAddBookmark}
              size="l"
            >
              <Icon name="plus" className={styles.plusIcon} />
              {t('Add bookmark')}
            </PrimaryButton>
          </>

        </BoxEmptyState>
      )}
  </>
);

export default EmptyState;
