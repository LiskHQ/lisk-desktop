import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Transactions from './../transactions';
import Send from '../send';
import styles from './styles.css';

const TransactionsDashboard = () => (
  <div className={`${grid.row} ${styles.wrapper}`} >
    <div className={`${grid['col-md-4']}`}>
      <Send />
    </div>
    <div className={`${grid['col-xs-12']} ${styles.transactions} ${grid['col-sm-8']}`}>
      <Transactions></Transactions>
    </div>
  </div>
);

export default TransactionsDashboard;
