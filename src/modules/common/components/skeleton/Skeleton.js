import React from 'react';
import styles from './Skeleton.css';

const Skeleton = ({ radius = 20, width = '50%', height = 15, theme = 'rect' }) => (
  <>
    <div
      data-testid="skeleton-wrapper"
      className={`${styles.skeletonWrapper} ${styles[theme]}`}
      style={{
        width: theme === 'circle' ? 2 * radius : width,
        height: theme === 'circle' ? 2 * radius : height,
      }}
    />
    {theme === 'walletWithAddress' && (
      <div data-testid="wallet-address-skeleton-wrapper" className={styles.skeletonWrapper} />
    )}
  </>
);

export default Skeleton;
