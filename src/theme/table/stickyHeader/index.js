import React from 'react';
import styles from './stickyHeader.css';

const StickyHeader = ({ title, filters, className }) => (
  <div className={[className, styles.header].join(' ')}>
    {title ? <h1>{title}</h1> : null}
    {filters}
  </div>
);

export default StickyHeader;
