import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Transactions from './../transactions';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import ResultBox from '../resultBox';
import MultiStep from './../multiStep';
import styles from './styles.css';

const TransactionsDashboard = () => (
  <div className={`${grid.row} ${styles.wrapper}`} >
    <div className={`${grid['col-xs-4']}`}>
      <div className={`box ${styles.send}`}>
        <MultiStep>
          <SendWritable/>
          <SendReadable />
          <ResultBox />
        </MultiStep>
      </div>
    </div>
    <div className={`${grid['col-xs-8']}`}>
      <Transactions></Transactions>
    </div>
  </div>
);

export default TransactionsDashboard;
