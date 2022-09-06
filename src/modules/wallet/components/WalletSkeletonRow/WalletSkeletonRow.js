import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Skeleton from '../../../common/components/skeleton';
import styles from './WalletSkeletonRow.css';

const WalletSkeletonRow = () => (
  <div data-testid="skeleton-row" className={`${styles.skeletonRowWrapper} ${grid.row}`}>
    <div className={`${grid['col-xs-1']} ${grid['col-md-1']}`}>
      <Skeleton rect width="40%" />
    </div>
    <div className={`${grid['col-xs-3']} ${grid['col-md-5']}`}>
      <Skeleton circle radius={20} />
    </div>
    <div className={`${grid['col-xs-3']} ${grid['col-md-3']}`}>
      <Skeleton rect width="60%" />
    </div>
    <div className={`${grid['col-xs-5']} ${grid['col-md-3']}`}>
      <Skeleton rect width="40%" />
    </div>
  </div>
);

export default WalletSkeletonRow;
