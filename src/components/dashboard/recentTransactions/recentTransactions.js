import React, { Component } from 'react';
import Box from '../../boxV3';
import removeDuplicateTransactions from '../../../utils/transactions';
import styles from './recentTransactions';

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
        title={`Recent ${activeToken} Transactions`}
        t={t}
      >
        <div className={styles.wrapper}>
          {activeToken}
          {
            this.getLatestTransactions().map((tx, index) =>
              <li key={index}>{tx.type} - {tx.recipientId} - {tx.amount}</li>)
          }
        </div>
      </Box>
    );
  }
}

export default RecentTransactions;
