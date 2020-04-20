import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';
import EmptyState from '../../../toolbox/box/emptyState';
import Illustration from '../../../toolbox/illustration';
import ProgressBar from '../../../toolbox/progressBar/progressBar';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';
import actionTypes from '../../../../constants/actions';
import styles from './transactionsList.css';
import txFilters from '../../../../constants/transactionFilters';
import transactionTypes from '../../../../constants/transactionTypes';

class TransactionsList extends React.Component {
  render() {
    const {
      transactions,
      address,
      bookmarks,
      canLoadMore,
      loading,
      isSmallScreen,
      t,
      activeToken,
    } = this.props;
    // All, incoming, outgoing are filter values. To be more consistance with other possible tabs
    // We can refer to props.filter as tabObj

    const tabObj = this.props.filter;
    const fixIncomingFilter = (transaction) => {
      const isTypeNonSend = transaction.type !== transactionTypes().send.code;
      const isFilterIncoming = tabObj && tabObj.value === txFilters.incoming;
      const isAccountInit = transaction.type === transactionTypes().send.code
        && transaction.senderId === transaction.recipientId;

      return !(isFilterIncoming && (isTypeNonSend || isAccountInit));
    };
    const filteredTransactions = transactions.filter(fixIncomingFilter);

    const isLoading = loading.filter(type =>
      actionTypes.getTransactions === type).length > 0;

    const showDetails = activeToken !== tokenMap.BTC.key;

    const columnClassNames = {
      ...(showDetails ? {
        transaction: `${grid['col-md-4']} ${grid['col-xs-5']}`,
        date: grid['col-xs-2'],
        fee: `${styles.hideMedium} ${grid['col-xs-2']}`,
        details: `${grid['col-md-2']} ${grid['col-xs-3']}`,
      } : {
        transaction: grid['col-xs-5'],
        date: grid['col-xs-3'],
        fee: grid['col-xs-2'],
        details: styles.hide,
      }),
      amount: grid['col-xs-2'],
    };

    return (
      <div className={`${styles.results} ${canLoadMore ? styles.hasMore : ''} ${isLoading ? styles.isLoading : ''} transaction-results`}>
        {
        isLoading ? (
          <div className={styles.loadingOverlay}>
            <ProgressBar type="linear" mode="indeterminate" theme={styles} className="loading" />
          </div>
        ) : null
      }
        {filteredTransactions.length
          ? (
            <React.Fragment>
              <TransactionsHeader
                isSmallScreen={isSmallScreen}
                columnClassNames={columnClassNames}
              />
              {
                filteredTransactions
                  .map(transaction => (
                    <TransactionRow
                      key={transaction.id}
                      bookmarks={bookmarks}
                      address={address}
                      value={transaction}
                      token={activeToken}
                      columnClassNames={columnClassNames}
                      onClick={this.props.onClick}
                    />
                  ))
              }
            </React.Fragment>
          )
          : (
            <EmptyState className={styles.emptyState}>
              <Illustration name="emptyWallet" />
              <h3>{t('No transactions found.')}</h3>
            </EmptyState>
          )
      }
        { canLoadMore ? (
          <span
            onClick={this.props.onLoadMore}
            className={`${styles.showMore} show-more-button`}
          >
            {t('Load more')}
          </span>
        ) : null
        }
      </div>
    );
  }
}

export default withTranslation()(TransactionsList);
