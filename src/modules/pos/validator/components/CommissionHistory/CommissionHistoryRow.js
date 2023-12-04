import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './styles.css';

const CommissionHistoryRow = ({ timestamp, oldCommission, newCommission }) => (
  <div className={grid.row}>
    <div className={`${grid['col-md-6']} ${styles.timestamp}`}>
      <span>{timestamp}</span>
    </div>
    <div className={`${grid['col-md-3']} ${styles.commission}`}>
      <span>{oldCommission}</span>
    </div>
    <div className={`${grid['col-md-6']} ${styles.commission}`}>
      <span>{newCommission}</span>
    </div>
  </div>
);

export default CommissionHistoryRow;
