import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import { tokenMap } from '../../constants/tokens';
import TransactionsHeaderV2 from './transactionsHeaderV2';
import TransactionRowV2 from './transactionRowV2';
import txFilters from '../../constants/transactionFilters';
import txTypes from '../../constants/transactionTypes';
import styles from './transactionsListV2.css';
import ProgressBar from '../toolbox/progressBar/progressBar';
import actionTypes from '../../constants/actions';

class TransactionsListV2 extends React.Component {
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
      const isTypeNonSend = transaction.type !== txTypes.send;
      const isFilterIncoming = tabObj && tabObj.value === txFilters.incoming;
      const isAccountInit = transaction.type === txTypes.send
        && transaction.senderId === transaction.recipientId;

      return !(isFilterIncoming && (isTypeNonSend || isAccountInit));
    };
    const filteredTransactions = transactions.filter(fixIncomingFilter);

    const isLoading = loading.filter(type =>
      actionTypes.transactionsLoaded === type).length > 0;

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
        <TransactionsHeaderV2
          isSmallScreen={isSmallScreen}
          columnClassNames={columnClassNames}
        />
        {filteredTransactions.length
          ? filteredTransactions
            .map(transaction => (
              <TransactionRowV2
                key={transaction.id}
                bookmarks={bookmarks}
                address={address}
                value={transaction}
                token={activeToken}
                columnClassNames={columnClassNames}
                onClick={this.props.onClick}
              />
            ))
          : (
            <p className={`${styles.empty} empty-message`}>
              {t('There are no transactions.')}
            </p>
          )
      }
        { canLoadMore && (
        <span
          onClick={this.props.onLoadMore}
          className={`${styles.showMore} show-more-button`}
        >
          {t('Show More')}
        </span>
        )
      }
      </div>
    );
  }
}

export default translate()(TransactionsListV2);
