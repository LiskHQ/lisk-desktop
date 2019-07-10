import React from 'react';
import styles from './pageHeader.css';

const PageHeader = ({
  title, subtitle, children,
}) => (
  <header className={styles.wrapper}>
    <span>
      <h1>{title}</h1>
      <div className={styles.subtitle}>{subtitle}</div>
    </span>
    <span>
      {children}
    </span>
  </header>
);

export default PageHeader;
