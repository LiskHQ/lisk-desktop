import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Transactions from './../transactions';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import ResultBox from '../resultBox';
import MultiStep from './../multiStep';
import Box from '../box';
import styles from './styles.css';

const TransactionsDashboard = () => (
  <div className={`${grid.row} ${styles.wrapper}`} >
    <div className={`${grid['col-xs-0']} ${grid['col-sm-4']}`}>
      <Box className={`${styles.send}`}>
        <MultiStep>
          <SendWritable/>
          <SendReadable />
          <ResultBox />
        </MultiStep>
      </Box>
    </div>
    <div className={`${grid['col-xs-12']} ${grid['col-sm-8']}`}>
      <Transactions></Transactions>
    </div>
  </div>
);

export default TransactionsDashboard;
