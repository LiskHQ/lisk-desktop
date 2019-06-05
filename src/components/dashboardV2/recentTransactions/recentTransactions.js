import React, { Component } from 'react';
import Box from '../../boxV2';
import removeDuplicateTransactions from '../../../utils/transactions';
import TransactionList from './transactionList';
import EmptyState from '../../emptyStateV2';
import svg from '../../../utils/svgIcons';
import links from '../../../constants/externalLinks';
import { tokenMap } from '../../../constants/tokens';
import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import styles from './recentTransactions.css';

class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    this.getLatestTransactions = this.getLatestTransactions.bind(this);
  }

  getLatestTransactions() {
    const { transactions, settings } = this.props;
    const latestTx = removeDuplicateTransactions(transactions.pending, transactions.confirmed);
    const filteredTxs = latestTx.filter(tx => tx.token === settings.token.active);
    return filteredTxs.length >= 5 ? filteredTxs.slice(0, 5) : filteredTxs;
  }

  render() {
    const {
      account,
      bookmarks,
      className,
      isSignIn,
      settings,
      t,
    } = this.props;
    const activeToken = tokenMap[settings.token.active];
    const transactionList = this.getLatestTransactions();

    return (
      <Box className={`${styles.box} ${className}`}>
      <header>
        <h2 className={styles.title}>{t('Recent {{value}} transactions', { value: activeToken.label })}</h2>
      </header>
        {
          isSignIn && transactionList.length
            ? <TransactionList
                account={account}
                activeToken={activeToken.key}
                bookmarks={bookmarks}
                transactions={transactionList}
                t={t}/>
            : null
        }
        {
          isSignIn && !transactionList.length
          ? <EmptyState>
              <img src={svg.icon_empty_recent_transactions} />
              <h1>{t('No Transactions Yet')}</h1>
              <p>{t('A great way to start is to top up your account with some {{value}} tokens.', { value: activeToken.key })}</p>
              <div>
              {
                // TODO this validation should be remove once we have the external link for BTC
                activeToken.key === tokenMap.LSK.key
                ? <a href={links.outgoingTransactions}
                    rel="noopener noreferrer"
                    target="_blank">
                    <SecondaryButtonV2>{t('Learn more')}</SecondaryButtonV2>
                  </a>
                : null
              }
              </div>
            </EmptyState>
          : null
        }
        {
          !isSignIn
          ? <EmptyState>
              <img src={svg.icon_empty_recent_transactions} />
              <h1>{t('Sign in to view recent transactions')}</h1>
              <p>{t('In order to see your recent transactions you need to sign in.')}</p>
            </EmptyState>
          : null
        }
      </Box>
    );
  }
}

export default RecentTransactions;
