import { Link } from 'react-router-dom';
import React from 'react';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import BookmarksList from './bookmarksList/bookmarksList';
import routes from '../../constants/routes';
import styles from './bookmarks.css';

const Bookmarks = ({
  bookmarks, token, t, bookmarkRemoved, bookmarkUpdated,
}) => (
  <div className={styles.wrapper}>
    <div className={styles.content}>
      <header>
        <span>
          <h1>{t('Bookmarks')}</h1>
          <div className={styles.subtitle}>{t('Manage your most used accounts')}</div>
        </span>
        <Link to={routes.addBookmark.path}>
          <PrimaryButtonV2>{t('Add a new bookmark')}</PrimaryButtonV2>
        </Link>
      </header>
      <BookmarksList
        title={t('All bookmarks')}
        enableFilter
        isEditable
        bookmarks={bookmarks}
        bookmarkRemoved={bookmarkRemoved}
        bookmarkUpdated={bookmarkUpdated}
        token={token}
        t={t}
        emptyStateClassName={styles.emptyState}
      />
    </div>
  </div>
);

export default Bookmarks;
