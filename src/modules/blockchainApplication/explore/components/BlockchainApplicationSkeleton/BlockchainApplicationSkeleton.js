import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './BlockchainApplicationSkeleton.css';

const BlockchainApplicationSkeletonRow = () => (
  <div data-testid="skeleton-row" className={`${styles.skeletonLoader} ${grid.row}`}>
    <div className={grid['col-xs-4']}>
      <div />
      <div />
    </div>
    <div className={grid['col-xs-3']}>
      <div />
    </div>
    <div className={grid['col-xs-2']}>
      <div />
    </div>
    <div className={grid['col-xs-3']}>
      <div />
    </div>
  </div>
);

const BlockchainApplicationSkeleton = () => (
  <>
    {[...new Array(5).keys()].map((index) => (
      <BlockchainApplicationSkeletonRow isLoading key={`skeleton-${index}`} />
    ))}
  </>
);

export default BlockchainApplicationSkeleton;
