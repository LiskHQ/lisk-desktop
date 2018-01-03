import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Transactions from './../transactions';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import ResultBox from '../resultBox';
import MultiStep from './../multiStep';
import Box from '../box';
import styles from './styles.css';

const Dashboard = () => (
  <div className={`${grid.row} ${styles.wrapper}`} >
    <div className={`${grid['col-md-8']} ${grid['col-xs-12']}`}>
      <Box className={`${styles.graph}`}>
      </Box>
      <Box className={`${styles.latestActivity}`}>
        <Transactions></Transactions>
      </Box>
    </div>
    <div className={`${grid['col-md-4']} ${styles.sendWrapper}`}>
      <Box className={`${styles.send}`}>
        <MultiStep>
          <SendWritable/>
          <SendReadable />
          <ResultBox />
        </MultiStep>
      </Box>
    </div>
  </div>
);

export default Dashboard;
