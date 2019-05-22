// istanbul ignore file
import React, { Component } from 'react';
import Box from '../../boxV3';
import removeDuplicateTransactions from '../../../utils/transactions';
import TransactionList from './transactionList';
import EmptyState from '../../emptyStateV2';
import { tokenMap } from '../../../constants/tokens';
import svg from '../../../utils/svgIcons';
import styles from './recentTransactions.css';

class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    this.getLatestTransactions = this.getLatestTransactions.bind(this);
  }

  getLatestTransactions() {
    const { transactions, settings } = this.props;
    if (settings.token.active === tokenMap.LSK.key) {
      const latestTx = removeDuplicateTransactions(transactions.pending, transactions.confirmed);
      return latestTx.length >= 5 ? latestTx.slice(0, 5) : latestTx;
    }
    // TODO once we know how to get latest BTC tx we can do this part here
    return [];
  }

  render() {
    const {
      account,
      followedAccounts,
      settings,
      t,
    } = this.props;
    const activeToken = settings.token.active || 'LSK';
    const transactionList = this.getLatestTransactions();

    return (
      <Box
        className={`${styles.box}`}
        title={`Recent ${activeToken} Transactions`}
        t={t}
      >
      {
        transactionList.length
        ? <TransactionList
            account={account}
            activeToken={activeToken}
            followedAccounts={followedAccounts}
            transactions={transactionList}
            t={t}/>
        : <EmptyState
            t={t}
            title={t('No Transactions Yet')}
            description={t('A great way to start is to top up your account with some LSK tokens.')}
            icon={svg.icon_empty_recent_transactions}
          />
      }
      </Box>
    );
  }
}

export default RecentTransactions;
