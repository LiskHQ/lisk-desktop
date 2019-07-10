import React from 'react';
import styles from './pageHeader.css';

const PageHeader = ({
  title, subtitle, children,
}) => (
  <header className={styles.wrapper}>
    <div>
      <h1>{title}</h1>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
    <div>
      {children}
    </div>
  </header>
);

export default PageHeader;
