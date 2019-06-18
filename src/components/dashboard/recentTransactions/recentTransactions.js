import React, { Component } from 'react';
import Box from '../../boxV2';
import TransactionList from './transactionList';
import EmptyState from '../../emptyStateV2';
import Icon from '../../toolbox/icon';
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
    const { transactions } = this.props;
    return [...transactions.pending, ...transactions.confirmed].slice(0, 5);
  }

  render() {
    const {
      account,
      bookmarks,
      className,
      isLoggedIn,
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
          isLoggedIn && transactionList.length
            ? <TransactionList
                account={account}
                activeToken={activeToken.key}
                bookmarks={bookmarks}
                transactions={transactionList}
                t={t}/>
            : null
        }
        {
          isLoggedIn && !transactionList.length
          ? <EmptyState>
              <Icon name={'icon_empty_recent_transactions'} />
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
          !isLoggedIn
          ? <EmptyState>
              <Icon name={'icon_empty_recent_transactions'} />
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
