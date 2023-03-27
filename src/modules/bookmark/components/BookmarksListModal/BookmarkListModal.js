import React from 'react';
import { withRouter } from 'react-router';
import { removeSearchParamsFromUrl, addSearchParamsToUrl } from 'src/utils/searchParams';
import BookmarksList from '@bookmark/components/BookmarksList';
import ModalWrapper from '@bookmark/components/BookmarksListModal/BookmarkModalWrapper';
import styles from '@bookmark/components/BookmarksListModal/BookmarkListModal.css';

const Bookmarks = ({ bookmarks, token, t, bookmarkRemoved, bookmarkUpdated, history }) => (
  <ModalWrapper>
    <BookmarksList
      enableFilter
      isEditable
      bookmarks={bookmarks}
      bookmarkRemoved={bookmarkRemoved}
      bookmarkUpdated={bookmarkUpdated}
      token={token}
      t={t}
      emptyStateClassName={styles.emptyState}
      onAddBookmark={() => {
        removeSearchParamsFromUrl(history, ['modal']);
        addSearchParamsToUrl(history, { modal: 'addBookmark' });
      }}
    />
  </ModalWrapper>
);

export default withRouter(Bookmarks);
