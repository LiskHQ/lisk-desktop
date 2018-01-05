import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import React from 'react';

import { FontIcon } from '../fontIcon';
import Box from '../box';
import MultiStep from './../multiStep';
import TransactionList from './../transactions/transactionList';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import ResultBox from '../resultBox';
import styles from './styles.css';

const Dashboard = ({ t, transactions }) => (
  <div className={`${grid.row} ${styles.wrapper}`} >
    <div className={`${grid['col-md-8']} ${grid['col-xs-12']}`}>
      <Box className={`${styles.graph}`}>
      </Box>
      <Box className={`${styles.latestActivity}`}>
        <header>
          <h2 className={styles.title}>
            {t('Latest activity')}
            <Link to='/main/transactions' className={styles.seeAllLink}>
              {t('See all transactions')}
              <FontIcon value='arrow-right' />
            </Link>
          </h2>
        </header>
        <TransactionList {...{ transactions, t }} loadMore={() => {}} />
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

const mapStateToProps = state => ({
  transactions: [...state.transactions.pending, ...state.transactions.confirmed].slice(0, 3),
});

export default connect(mapStateToProps)(translate()(Dashboard));
