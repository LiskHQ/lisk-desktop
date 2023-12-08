import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import styles from './styles.css';

const CommissionHistoryRow = ({ data, index }) => {
  const isLatest = index === 0;
  return (
    <div className={`${grid.row} ${styles.historyDetailsRow}`}>
      <div className={`${grid['col-md-6']} ${styles.timestamp}`}>
        <span>
          <DateTimeFromTimestamp time={data.block.timestamp} fulltime />
        </span>
      </div>
      <div className={`${grid['col-md-3']} ${styles.commission}`}>
        <span>{data.data.oldCommission / 100}</span>
      </div>
      <div className={`${grid['col-md-3']} ${styles.commission} ${isLatest ? styles.latest : ''}`}>
        <span>{data.data.newCommission / 100} </span>
        {isLatest ? <span>(Latest)</span> : null}
      </div>
    </div>
  );
};

export default CommissionHistoryRow;
