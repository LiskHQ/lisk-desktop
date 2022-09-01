import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Skeleton from '../../../common/components/skeleton';
import styles from './BlockSkeletonRow.css';

const BlockSkeletonRow = () => (
  <div data-testid="skeleton-row" className={`${styles.skeletonRowWrapper} ${grid.row}`}>
    <div className={grid['col-xs-3']}>
      <Skeleton rect width="60%" />
    </div>
    <div className={grid['col-xs-3']}>
      <Skeleton rect width="35%" />
    </div>
    <div className={grid['col-xs-3']}>
      <Skeleton rect width="40%" />
    </div>
    <div className={grid['col-xs-2']}>
      <Skeleton rect width="50%" />
    </div>
    <div className={grid['col-xs-1']}>
      <Skeleton circle radius={20} />
    </div>
  </div>
);

export default BlockSkeletonRow;
