import React, { Component } from 'react';
import Box from '../../boxV3';
import removeDuplicateTransactions from '../../../utils/transactions';
import TransactionList from './transactionsList';
import styles from './recentTransactions.css';

class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    this.onTabClick = this.onTabClick.bind(this);
    this.getLatestTransactions = this.getLatestTransactions.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onTabClick(tab) {
    console.log(tab);
  }

  getLatestTransactions() {
    const { transactions } = this.props;
    const latestTx = removeDuplicateTransactions(transactions.pending, transactions.confirmed);
    return latestTx.length >= 5 ? latestTx.slice(0, 5) : latestTx;
  }

  render() {
    const { settings, t } = this.props;
    const activeToken = settings.token.active || 'LSK';

    return (
      <Box
        className={`${styles.box}`}
        title={`Recent ${activeToken} Transactions`}
        t={t}>
        <TransactionList
          transactions={this.getLatestTransactions()}
          t={t}/>
      </Box>
    );
  }
}

export default RecentTransactions;
