import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Skeleton from '../../../../common/components/skeleton';
import styles from './WalletTransactionSkeletonRow.css';

const WalletTransactionSkeletonRow = () => (
  <div data-testid="skeleton-row" className={`${styles.skeletonRowWrapper} ${grid.row}`}>
    <div className={grid['col-xs-4']}>
      <Skeleton circle radius={20} />
    </div>
    <div className={grid['col-xs-2']}>
      <Skeleton rect width="60%" />
    </div>
    <div className={grid['col-xs-2']}>
      <Skeleton rect width="60%" />
    </div>
    <div className={grid['col-xs-2']}>
      <Skeleton rect width="80%" />
    </div>
    <div className={grid['col-xs-2']}>
      <Skeleton rect width="60%" right />
    </div>
  </div>
);

export default WalletTransactionSkeletonRow;
