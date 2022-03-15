import React from 'react';
import styles from './bookmarks.css';

const Wrapper = ({ children }) => (
  <div className={styles.wrapper}>
    <div className={styles.content}>
      {children}
    </div>
  </div>
);

export default Wrapper;
