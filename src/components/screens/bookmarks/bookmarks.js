import React from 'react';
import MultiStep from '../../shared/multiStep';
import BookmarksList from './bookmarksList/bookmarksList';
import AddBookmark from './addBookmark';
import styles from './bookmarks.css';

const Bookmarks = ({
  bookmarks, token, t, bookmarkRemoved, bookmarkUpdated, step,
}) => (
  <div className={styles.wrapper}>
    <div className={styles.content}>
      {step === 'add' ? <AddBookmark /> : (
        <MultiStep
          key="bookmarks"
        >
          <BookmarksList
            enableFilter
            isEditable
            bookmarks={bookmarks}
            bookmarkRemoved={bookmarkRemoved}
            bookmarkUpdated={bookmarkUpdated}
            token={token}
            t={t}
            emptyStateClassName={styles.emptyState}
          />
          <AddBookmark />
        </MultiStep>
      )}
    </div>
  </div>
);

export default Bookmarks;
