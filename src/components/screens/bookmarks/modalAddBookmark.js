import React from 'react';
import { withRouter } from 'react-router';
import AddBookmark from './addBookmark';
import styles from './bookmarks.css';
import { removeSearchParamsFromUrl } from '../../../utils/searchParams';

const modalAddBookmarks = ({ history }) => (
  <div className={styles.wrapper}>
    <div className={styles.content}>
      <AddBookmark
        prevStep={() => {
          removeSearchParamsFromUrl(history, ['modal']);
        }}
        edit
      />
    </div>
  </div>
);

export default withRouter(modalAddBookmarks);
