import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Skeleton from '../../../common/components/skeleton';
import styles from './TransactionSkeletonRow.css';

const TransactionSkeletonRow = () => (
  <div data-testid="skeleton-row" className={`${styles.skeletonRowWrapper} ${grid.row}`}>
    <div className={grid['col-xs-3']}>
      <Skeleton circle radius={20} />
    </div>
    <div className={grid['col-xs-3']}>
      <Skeleton circle radius={20} />
    </div>
    <div className={grid['col-xs-2']}>
      <Skeleton rect width="60%" />
    </div>
    <div className={grid['col-xs-2']}>
      <Skeleton rect width="50%" />
    </div>
    <div className={grid['col-xs-1']}>
      <Skeleton rect width="70%" />
    </div>
    <div className={grid['col-xs-1']}>
      <Skeleton rect width="40%" right />
    </div>
  </div>
);

export default TransactionSkeletonRow;
