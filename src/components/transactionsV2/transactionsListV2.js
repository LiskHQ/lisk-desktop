import React from 'react';
import { translate } from 'react-i18next';
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
      followedAccounts,
      canLoadMore,
      loading,
      isSmallScreen,
      t,
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

    const isLoading = loading.filter(type =>
      [actionTypes.transactionsRequested, actionTypes.transactionsFilterSet]
        .includes(type)).length > 0;

    return <div className={`${styles.results} ${canLoadMore ? styles.hasMore : ''} ${isLoading ? styles.isLoading : ''} transaction-results`}>
      {
        isLoading ? (
          <div className={styles.loadingOverlay}>
            <ProgressBar type="linear" mode="indeterminate" theme={styles} className={'loading'}/>
          </div>
        ) : null
      }
      <TransactionsHeaderV2 isSmallScreen={isSmallScreen} />
      {transactions.length
        ? transactions.filter(fixIncomingFilter)
            .map((transaction, i) =>
              <TransactionRowV2 key={i}
                followedAccounts={followedAccounts}
                address={address}
                value={transaction}
                onClick={this.props.onClick}/>)
        : <p className={`${styles.empty} empty-message`}>
          {t('There are no transactions.')}
        </p>
      }
      { canLoadMore && <span
        onClick={this.props.onLoadMore}
        className={`${styles.showMore} show-more-button`}>{t('Show More')}</span>
      }
    </div>;
  }
}

export default translate()(TransactionsListV2);
