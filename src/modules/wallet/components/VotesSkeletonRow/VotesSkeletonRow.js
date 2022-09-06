import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Skeleton from '../../../common/components/skeleton';
import styles from './VotesSkeletonRow.css';

const VotesSkeletonRow = () => (
  <div data-testid="skeleton-row" className={`${styles.skeletonRowWrapper} ${grid.row}`}>
    <div className={grid['col-sm-5']}>
      <Skeleton rect width="20%" />
    </div>
    <div className={grid['col-sm-2']}>
      <Skeleton rect width="20%" />
    </div>
    <div className={grid['col-sm-2']}>
      <Skeleton rect width="60%" />
    </div>
    <div className={grid['col-sm-2']}>
      <Skeleton rect width="60%" right />
    </div>
    <div className={grid['col-sm-1']}>
      <Skeleton rect width="0%" />
    </div>
  </div>
);

export default VotesSkeletonRow;
