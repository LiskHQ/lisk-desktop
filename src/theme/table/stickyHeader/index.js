import React from 'react';
import styles from './stickyHeader.css';

const StickyHeader = ({
  title,
  filters,
}) => (
  <div className={styles.header}>
    <h1>{title}</h1>
    {filters}
  </div>
);

export default StickyHeader;
