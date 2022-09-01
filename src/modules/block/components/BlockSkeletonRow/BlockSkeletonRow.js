import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './BlockSkeletonRow.css';

const BlockSkeletonRow = () => (
  <div data-testid="skeleton-row" className={`${styles.skeletonRowWrapper} ${grid.row}`}>
    <div className={grid['col-xs-3']}>
      <div />
    </div>
    <div className={grid['col-xs-3']}>
      <div />
    </div>
    <div className={grid['col-xs-3']}>
      <div />
    </div>
    <div className={grid['col-xs-2']}>
      <div />
    </div>
    <div className={grid['col-xs-1']}>
      <div />
    </div>
  </div>
);

export default BlockSkeletonRow;
