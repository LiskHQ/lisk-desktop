import React from 'react';
import styles from './pageHeader.css';

const PageHeader = ({
  title, subtitle, children, className,
}) => (
  <header className={`${styles.wrapper} ${className}`}>
    <div>
      <h1>{title}</h1>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
    <div>
      {children}
    </div>
  </header>
);

PageHeader.defaultProps = {
  className: '',
};

export default PageHeader;
