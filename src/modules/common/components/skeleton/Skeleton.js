import React from 'react';
import styles from './Skeleton.css';

const Skeleton = ({
  radius = 20,
  width = '50%',
  height = 15,
  right = false,
  theme = 'rect',
  className,
}) => (
  <div
    data-testid="skeleton-wrapper"
    className={`${styles.skeletonWrapper} ${styles[theme]} ${className || ''}`}
    style={{
      width: theme === 'circle' ? 2 * radius : width,
      height: theme === 'circle' ? 2 * radius : height,
      textAlign: right ? 'right' : 'left',
    }}
  />
);

export default Skeleton;
