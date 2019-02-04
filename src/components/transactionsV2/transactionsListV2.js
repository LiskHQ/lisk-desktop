import React from 'react';
import { translate } from 'react-i18next';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import TransactionsHeaderV2 from './transactionsHeaderV2';
import TransactionRowV2 from './transactionRowV2';
import txFilters from '../../constants/transactionFilters';
import txTypes from '../../constants/transactionTypes';
import styles from './transactionsListV2.css';

class TransactionsListV2 extends React.Component {
  render() {
    const {
      transactions,
      address,
      followedAccounts,
      canLoadMore,
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

    return <div className={`${styles.results} ${canLoadMore ? styles.hasMore : ''} transaction-results`}>
      <TransactionsHeaderV2 tableStyle={tableStyle} />
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
        className={styles.showMore}>{t('Show More')}</span>
      }
    </div>;
  }
}

export default translate()(TransactionsListV2);
