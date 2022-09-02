import React from 'react';
import styles from './Skeleton.css';

const Skeleton = ({
  circle, radius = 20, width = '100%', height = 15,
}) => (
  <div
    data-testid="skeleton-wrapper"
    className={`${styles.skeletonWrapper} ${styles[circle ? 'circle' : 'rect']}`}
    style={{
      width: circle ? 2 * radius : width,
      height: circle ? 2 * radius : height,
    }}
  />
);

export default Skeleton;
