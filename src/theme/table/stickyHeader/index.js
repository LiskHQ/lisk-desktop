import React from 'react';
import styles from './stickyHeader.css';

const StickyHeader = ({ title, filters }) => (
  <div className={styles.header}>
    {title ? <h1>{title}</h1> : null}
    {filters}
  </div>
);

export default StickyHeader;
