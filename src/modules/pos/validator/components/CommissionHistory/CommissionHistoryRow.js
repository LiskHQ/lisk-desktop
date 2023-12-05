import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './styles.css';

const CommissionHistoryRow = ({ timestamp, oldCommission, newCommission, isLatest }) => (
  <div className={`${grid.row} ${styles.historyDetailsRow}`}>
    <div className={`${grid['col-md-6']} ${styles.timestamp}`}>
      <span>{timestamp}</span>
    </div>
    <div className={`${grid['col-md-3']} ${styles.commission}`}>
      <span>{oldCommission}</span>
    </div>
    <div className={`${grid['col-md-3']} ${styles.commission} ${isLatest ? styles.latest : ''}`}>
      <span>{newCommission} </span>
      {isLatest ? <span>(Latest)</span> : null}
    </div>
  </div>
);

export default CommissionHistoryRow;
