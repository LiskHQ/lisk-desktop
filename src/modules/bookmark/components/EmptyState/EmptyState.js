import React from 'react';
import Illustration from 'src/modules/common/components/illustration';
import { PrimaryButton } from 'src/theme/buttons';
import BoxEmptyState from 'src/theme/box/emptyState';
import Icon from 'src/theme/Icon';
import styles from '../BookmarksList/BookmarksList.css'; // @todo split the css

const EmptyState = ({ bookmarks, activeToken, emptyStateClassName, t, onAddBookmark }) => (
  <>
    {bookmarks[activeToken].length ? (
      <BoxEmptyState className={emptyStateClassName}>
        <Illustration name="emptyBookmarkFiler" className="bookmark-empty-filter-illustration" />
        <p>{t('There are no results matching your search term.')}</p>
      </BoxEmptyState>
    ) : (
      <BoxEmptyState className={emptyStateClassName}>
        <>
          <Illustration name="emptyBookmarksList" className="bookmarks-empty-illustration" />
          <p>{t('You do not have any bookmarks yet.')}</p>
          <PrimaryButton className={styles.addButton} onClick={onAddBookmark} size="l">
            <Icon name="plus" className={styles.plusIcon} />
            {t('Add bookmark')}
          </PrimaryButton>
        </>
      </BoxEmptyState>
    )}
  </>
);

export default EmptyState;
