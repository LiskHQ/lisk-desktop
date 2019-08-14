import React, { Component } from 'react';
import { SecondaryButton } from '../../toolbox/buttons/button';
import { tokenMap } from '../../../constants/tokens';
import Box from '../../toolbox/box';
import Icon from '../../toolbox/icon';
import TransactionList from './transactionList';
import links from '../../../constants/externalLinks';
import styles from './recentTransactions.css';
import txFilters from '../../../constants/transactionFilters';

class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    if (!props.transactions.length && props.account.address) {
      props.getTransactions({
        address: props.account.address,
        filters: {
          direction: txFilters.all,
        },
      });
    }
  }

  render() {
    const {
      account,
      bookmarks,
      className,
      isLoggedIn,
      settings,
      t,
      transactions,
    } = this.props;
    const activeToken = tokenMap[settings.token.active];

    return (
      <Box className={`${styles.box} ${className}`}>
        <Box.Header>
          <h2 className={styles.title}>{t('Recent {{value}} transactions', { value: activeToken.label })}</h2>
        </Box.Header>
        {
          isLoggedIn && transactions.length
            ? (
              <TransactionList
                account={account}
                activeToken={activeToken.key}
                bookmarks={bookmarks}
                transactions={transactions}
                t={t}
              />
            )
            : null
        }
        {
          isLoggedIn && !transactions.length
            ? (
              <Box.EmptyState>
                <Icon name="icon_empty_recent_transactions" />
                <h1>{t('No Transactions Yet')}</h1>
                <p>{t('A great way to start is to top up your account with some {{value}} tokens.', { value: activeToken.key })}</p>
                <div>
                  {
                // TODO this validation should be remove once we have the external link for BTC
                activeToken.key === tokenMap.LSK.key
                  ? (
                    <a
                      href={links.outgoingTransactions}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <SecondaryButton>{t('Learn more')}</SecondaryButton>
                    </a>
                  )
                  : null
              }
                </div>
              </Box.EmptyState>
            )
            : null
        }
        {
          !isLoggedIn
            ? (
              <Box.EmptyState>
                <Icon name="icon_empty_recent_transactions" />
                <h1>{t('Sign in to view recent transactions')}</h1>
                <p>{t('In order to see your recent transactions you need to sign in.')}</p>
              </Box.EmptyState>
            )
            : null
        }
      </Box>
    );
  }
}

export default RecentTransactions;
